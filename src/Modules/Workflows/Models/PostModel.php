<?php

namespace PublishPress\Future\Modules\Workflows\Models;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Workflows\Domain\Engine\InputValidators\PostQuery;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\PostModelInterface;
use WP_Post;

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
        $postQueryValidator = new PostQuery();

        $validatedWorkflows = [];

        foreach ($workflows as &$workflow) {
            $workflowId = $workflow['workflowId'];

            $workflowModel = new WorkflowModel();
            $workflowModel->load($workflowId);

            // Validate the trigger's post query
            $triggers = $workflowModel->getTriggerNodes();
            foreach ($triggers as $trigger) {
                if ($trigger['data']['name'] !== CoreOnManuallyEnabledForPost::getNodeTypeName()) {
                    continue;
                }

                if ($postQueryValidator->validate(['post' => $this->post, 'node' => $trigger])) {
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

    public function getManuallyEnabledWorkflowsSchedule(int $workflowId): array
    {
        global $wpdb;

        $workflowModel = new WorkflowModel();

        $schedule = [];

        if (is_null($this->workflowsManuallyEnabled)) {
            // FIXME: Use dependency injection
            $nodeTypesModel = Container::getInstance()->get(ServicesAbstract::NODE_TYPES_MODEL);
            $allNodeTypes = $nodeTypesModel->getAllNodeTypesIndexedByName();

            $workflowModel->load($workflowId);

            // FIXME: Fix this for the new args table
            $query = "SELECT scheduled_date_gmt, args, extended_args
                FROM {$wpdb->prefix}actionscheduler_actions
                WHERE (JSON_EXTRACT(extended_args, '$[0].contextVariables.global.trigger.value.name') = %s)
                    OR (JSON_EXTRACT(args, '$[0].contextVariables.global.trigger.value.name') = %s)
                    OR (JSON_EXTRACT(extended_args, '$[0].runtimeVariables.global.trigger.value.name') = %s)
                    OR (JSON_EXTRACT(args, '$[0].runtimeVariables.global.trigger.value.name') = %s)
                AND status = 'pending'
                AND hook = %s
            ";
            $query = $wpdb->prepare(
                $query, // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
                'trigger/core.manually-enabled-for-post',
                'trigger/core.manually-enabled-for-post',
                'trigger/core.manually-enabled-for-post',
                'trigger/core.manually-enabled-for-post',
                HooksAbstract::ACTION_ASYNC_EXECUTE_NODE
            );

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
            $this->workflowsManuallyEnabled = $wpdb->get_results($query, ARRAY_A);
        }

        $actionsForWorkflows = $this->workflowsManuallyEnabled;

        if (empty($actionsForWorkflows)) {
            return [];
        }

        foreach ($actionsForWorkflows as $action) {
            $args = json_decode($action['extended_args'], true);

            if (! isset($args[0]['runtimeVariables']['global']['trigger']['value']['slug'])) {
                continue;
            }

            $triggerSlug = $args[0]['runtimeVariables']['global']['trigger']['value']['slug'];

            if (! isset($args[0]['runtimeVariables'][$triggerSlug]['postId'])) {
                continue;
            }

            $postId = $args[0]['runtimeVariables'][$triggerSlug]['postId']['value'];

            if ($postId !== $this->post->ID) {
                continue;
            }

            $nextStep = $args[0]['step']['next']['output'][0]['node'];

            $schedule[] = [
                'workflowId' => $workflowId,
                'workflowTitle' => $workflowModel->getManualSelectionLabel(),
                'timestamp' => $action['scheduled_date_gmt'],
                'nextStep' => $nextStep['data']['label'] ?? ($allNodeTypes[$nextStep['data']['name']])->getLabel(),
            ];
        }

        return $schedule;
    }
}
