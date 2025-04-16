<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostWorkflowEnable;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\PostModelInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use React\Socket\Server;
use Services_JSON;
use WP_Post;
use WPMailSMTP\Vendor\Google\Service;

class PostModel implements PostModelInterface
{
    public const META_KEY_WORKFLOW_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered';

    private $post;

    private $workflowsManuallyEnabled = null;

    public function load(int $id): bool
    {
        $this->reset();

        $post = get_post($id);

        if ((! ($post instanceof WP_Post))) {
            return false;
        }

        $this->post = $post;

        return true;
    }

    private function reset(): void
    {
        $this->post = null;
    }

    public function getId(): int
    {
        return $this->post->ID;
    }

    public function getTitle(): string
    {
        return $this->post->post_title;
    }

    public function getValidWorkflowsWithManualTrigger(int $postId): array
    {
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsWithManualTrigger();

        $postModel = new PostModel();
        $postModel->load($postId);
        $postObject = $postModel->getPostObject();

        $container = Container::getInstance();
        // TODO: Inject this
        $postQueryValidatorFactory = $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY_FACTORY);
        $workflowEngine = $container->get(ServicesAbstract::WORKFLOW_ENGINE);
        $executionContextRegistry = $container->get(ServicesAbstract::EXECUTION_CONTEXT_REGISTRY);
        $hooks = $container->get(ServicesAbstract::HOOKS);
        $expirablePostModelFactory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);

        $validatedWorkflows = [];

        foreach ($workflows as &$workflow) {
            $workflowId = $workflow['workflowId'];

            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflowId);

            // Prepare for a new context
            $workflowExecutionId = $workflowEngine->generateUniqueId();
            $postQueryValidator = $postQueryValidatorFactory($workflowExecutionId);

            $workflowEngine->prepareExecutionContextForWorkflow(
                $workflowExecutionId,
                $workflowModel
            );

            // Validate the trigger's post query
            $triggers = $workflowModel->getTriggerNodes();
            foreach ($triggers as $triggerStep) {
                $triggerName = $triggerStep['data']['name'];

                if ($triggerName !== OnPostWorkflowEnable::getNodeTypeName()) {
                    continue;
                }

                $workflowEngine->prepareExecutionContextForTrigger(
                    $workflowExecutionId,
                    $triggerStep
                );

                // Inject the trigger's data into the execution context
                $executionContext = $executionContextRegistry->getExecutionContext(
                    $workflowExecutionId
                );
                $executionContext->setVariable($triggerStep['data']['slug'], [
                    'post' => new PostResolver($postObject, $hooks, '', $expirablePostModelFactory),
                    'postId' => new IntegerResolver($postId)
                ]);

                if ($postQueryValidator->validate(['post' => $this->post, 'node' => $triggerStep])) {
                    $validatedWorkflows[] = $workflow;
                }
            }
        }

        return $validatedWorkflows;
    }

    public function getManuallyEnabledWorkflows(): array
    {
        $selectedWorkflowIds = get_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, false);
        $selectedWorkflowIds = array_map('intval', $selectedWorkflowIds);

        return $selectedWorkflowIds;
    }

    public function setManuallyEnabledWorkflows(array $workflowIds): void
    {
        $currentWorkflowIds = $this->getManuallyEnabledWorkflows();

        $workflowsToDisable = array_diff($currentWorkflowIds, $workflowIds);

        foreach ($workflowsToDisable as $workflowId) {
            $this->removeScheduledActionsFromDisabledWorkflows($workflowId);
        }

        delete_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED);

        foreach ($workflowIds as $workflowId) {
            $workflowId = (int)$workflowId;
            add_post_meta($this->post->ID, self::META_KEY_WORKFLOW_MANUALLY_TRIGGERED, $workflowId, false);
        }
    }

    public function addManuallyEnabledWorkflow(int $workflowId): void
    {
        $workflowIds = $this->getManuallyEnabledWorkflows();
        $workflowIds[] = $workflowId;

        $workflowIds = array_unique($workflowIds);

        $this->setManuallyEnabledWorkflows($workflowIds);
    }

    public function removeManuallyEnabledWorkflow(int $workflowId): void
    {
        $workflowIds = $this->getManuallyEnabledWorkflows();

        $workflowIds = array_filter($workflowIds, function ($id) use ($workflowId) {
            return $id !== $workflowId;
        });

        $this->setManuallyEnabledWorkflows($workflowIds);
    }

    private function removeScheduledActionsFromDisabledWorkflows(int $workflowId): void
    {
        // Check if the workflow has a scheduled action for this post
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelByWorkflowAndPostId($workflowId, $this->post->ID);
    }

    public function getManuallyEnabledWorkflowsSchedule(int $workflowId): array
    {
        global $wpdb;

        $workflowModel = new WorkflowModel();

        $schedule = [];

        if (is_null($this->workflowsManuallyEnabled)) {
            // FIXME: Use dependency injection
            $stepTypesModel = Container::getInstance()->get(ServicesAbstract::STEP_TYPES_MODEL);
            $allStepTypes = $stepTypesModel->getAllStepTypesIndexedByName();

            $workflowModel->load($workflowId);

            $query = "SELECT aa.scheduled_date_gmt, aa.args, aa.extended_args, aa.action_id
                FROM {$wpdb->prefix}actionscheduler_actions AS aa
                INNER JOIN {$wpdb->prefix}ppfuture_workflow_scheduled_steps AS ss ON ss.action_id = aa.action_id
                WHERE ss.post_id = %d
                AND aa.status = 'pending'
                AND aa.hook = %s
            ";
            $query = $wpdb->prepare(
                $query, // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
                $this->post->ID,
                HooksAbstract::ACTION_SCHEDULED_STEP_EXECUTE
            );

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
            $this->workflowsManuallyEnabled = $wpdb->get_results($query, ARRAY_A);
        }

        $actionsForWorkflows = $this->workflowsManuallyEnabled;

        if (empty($actionsForWorkflows)) {
            return [];
        }

        foreach ($actionsForWorkflows as $action) {
            $actionId = $action['action_id'];
            $scheduledStepModel = new WorkflowScheduledStepModel();
            $scheduledStepModel->loadByActionId($actionId);

            $args = $scheduledStepModel->getArgs();

            if (! isset($args['runtimeVariables']['global']['trigger']['value']['slug'])) {
                continue;
            }

            $triggerSlug = $args['runtimeVariables']['global']['trigger']['value']['slug'];

            if (! isset($args['runtimeVariables'][$triggerSlug]['postId'])) {
                continue;
            }

            $postId = $args['runtimeVariables'][$triggerSlug]['postId']['value'];

            if ($postId !== $this->post->ID) {
                continue;
            }

            $stepRoutineTree = $workflowModel->getPartialRoutineTreeFromNodeId($args['step']['nodeId']);

            if (empty($stepRoutineTree) || empty($stepRoutineTree['next'])) {
                continue;
            }

            $nextStep = $stepRoutineTree['next']['output'][0]['node'];

            if (empty($nextStep)) {
                continue;
            }

            $schedule[] = [
                'workflowId' => $workflowId,
                'workflowTitle' => $workflowModel->getManualSelectionLabel(),
                'timestamp' => $action['scheduled_date_gmt'],
                'nextStep' => $nextStep['data']['label'] ?? ($allStepTypes[$nextStep['data']['name']])->getLabel(),
            ];
        }

        return $schedule;
    }

    public function getPostObject(): \WP_Post
    {
        return $this->post;
    }
}
