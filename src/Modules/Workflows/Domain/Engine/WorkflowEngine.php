<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use Closure;
use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextRegistryInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowScheduledStepModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Modules\Workflows\Module;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Throwable;

class WorkflowEngine implements WorkflowEngineInterface
{
    public const LOG_PREFIX = '[WF Engine]';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var StepTypesModelInterface
     */
    private $stepTypesModel;

    /**
     * @var \Closure
     */
    private $stepRunnerFactory;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var int
     */
    private $currentAsyncActionId;

    /**
     * @var InitializableInterface
     */
    private $executionContextInitializer;

    /**
     * @var ExecutionContextRegistryInterface
     */
    private $executionContextRegistry;

    /**
     * @var string
     */
    private $engineExecutionId;

    /**
     * @var string
     */
    private $engineExecutionEnvironment;


    public function __construct(
        HookableInterface $hooks,
        StepTypesModelInterface $stepTypesModel,
        \Closure $stepRunnerFactory,
        ExecutionContextRegistryInterface $executionContextRegistry,
        LoggerInterface $logger,
        InitializableInterface $executionContextInitializer
    ) {
        $this->hooks = $hooks;
        $this->stepTypesModel = $stepTypesModel;
        $this->stepRunnerFactory = $stepRunnerFactory;
        $this->executionContextRegistry = $executionContextRegistry;
        $this->logger = $logger;
        $this->executionContextInitializer = $executionContextInitializer;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);

        $this->hooks->addAction(
            HooksAbstract::ACTION_EXECUTE_STEP,
            [$this, 'executeStepRoutine'],
            10,
            2
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ASYNC_EXECUTE_STEP,
            [$this, "executeAsyncStepRoutine"],
            10
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_UNSCHEDULE_RECURRING_STEP_ACTION,
            [$this, "unscheduleRecurringStepAction"],
            10,
            2
        );

        /**
         * We are keeping the old constant for compatibility with old actions scheduled by the old constant.
         */
        $this->hooks->addAction(
            HooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION,
            [$this, "unscheduleRecurringStepAction"],
            10,
            2
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULER_BEGIN_EXECUTE,
            [$this, "setCurrentAsyncActionId"]
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_POST_UPDATED,
            [$this, "onWorkflowUpdated"],
            10,
            3
        );
    }

    public function start()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

        $this->executionContextInitializer->initialize();

        $this->engineExecutionEnvironment = $this->getEngineExecutionEnvironment();

        $currentUser = wp_get_current_user();

        $this->logger->debug(
            sprintf(
                self::LOG_PREFIX . ' Starting engine | User: %s | Environment: %s',
                ($currentUser->ID > 0) ? "ID {$currentUser->ID}" : 'unknown',
                $this->engineExecutionEnvironment
            )
        );

        $publishedWorkflowsIds = $this->getPublishedWorkflowsIds();
        $stepTypes = $this->getAllStepTypes();

        $this->engineExecutionId = $this->generateUniqueId();

        // Setup the workflow triggers
        foreach ($publishedWorkflowsIds as $workflowId) {
            /** @var WorkflowModelInterface $workflow */
            $workflow = new WorkflowModel();
            $workflow->load($workflowId);

            $this->logger->debug(
                sprintf(
                    self::LOG_PREFIX . ' Initializing workflow | ID: %d | Title: %s',
                    $workflowId,
                    $workflow->getTitle()
                )
            );

            $workflowExecutionId = $this->generateUniqueId();
            $this->executionContextRegistry->getExecutionContext($workflowExecutionId);

            $triggerSteps = $workflow->getTriggerNodes();
            $routineTree = $workflow->getRoutineTree($stepTypes);

            $this->prepareExecutionContextForWorkflow(
                $workflowExecutionId,
                $workflow
            );

            foreach ($triggerSteps as $triggerStep) {
                $triggerName = $triggerStep['data']['name'];
                $triggerId = $triggerStep['id'];

                $stepType = $this->stepTypesModel->getStepType($triggerName);

                if (! $stepType) {
                    continue;
                }

                /** @var TriggerRunnerInterface $triggerRunner */
                $triggerRunner = call_user_func($this->stepRunnerFactory, $triggerName, $workflowExecutionId);

                if (is_null($triggerRunner)) {
                    $message = sprintf(
                        self::LOG_PREFIX . ' Trigger not found: %s',
                        $triggerName
                    );

                    $this->logger->error($message);

                    continue;
                }

                // Ignore if there is no routine tree for this trigger
                if (! isset($routineTree[$triggerId])) {
                    continue;
                }

                $this->prepareExecutionContextForTrigger(
                    $workflowExecutionId,
                    $triggerStep
                );

                // Setup the trigger
                $this->logger->debug(
                    sprintf(
                        self::LOG_PREFIX . '   - Setting up trigger | Slug: %s',
                        $triggerStep['data']['slug']
                    )
                );
                $triggerRunner->setup($workflowId, $routineTree[$triggerId]);
            }

            $this->logger->debug(
                sprintf(
                    self::LOG_PREFIX . ' Workflow initialized | ID: %d',
                    $workflowId
                )
            );
        }

        $this->logger->debug(self::LOG_PREFIX . ' Engine started and listening for events');
    }

    public function prepareExecutionContextForWorkflow(
        string $workflowExecutionId,
        WorkflowModelInterface $workflowModel
    ): void {
        $executionContext = $this->executionContextRegistry->getExecutionContext(
            $workflowExecutionId
        );

        $currentUser = wp_get_current_user();

        $globalVariables = [
            'engine_execution_id' => $this->engineExecutionId,
            'user' => new UserResolver($currentUser),
            'site' => new SiteResolver(),
            'workflow' => new WorkflowResolver(
                [
                    'id' => $workflowModel->getId(),
                    'title' => $workflowModel->getTitle(),
                    'description' => $workflowModel->getDescription(),
                    'modified_at' => $workflowModel->getModifiedAt(),
                    'execution_id' => $workflowExecutionId,
                    'execution_trace' => [],
                ]
            ),
        ];

        $executionContext->setVariable('global', $globalVariables);
    }

    public function prepareExecutionContextForTrigger(
        string $workflowExecutionId,
        array $triggerStep
    ): void {
        $stepType = $this->stepTypesModel->getStepType($triggerStep['data']['name']);

        $triggerContext = new NodeResolver(
            [
                'id' => $triggerStep['id'],
                'name' => $triggerStep['data']['name'],
                'label' => $stepType->getLabel(),
                'activation_timestamp' => date('Y-m-d H:i:s'),
                'slug' => $triggerStep['data']['slug'],
                'postId' => 0,
            ]
        );

        $executionContext = $this->executionContextRegistry->getExecutionContext(
            $workflowExecutionId
        );
        $executionContext->setVariable('global.trigger', $triggerContext);
    }

    public function setCurrentAsyncActionId($actionId)
    {
        $this->currentAsyncActionId = $actionId;
    }

    public function getCurrentAsyncActionId(): int
    {
        return (int) $this->currentAsyncActionId;
    }

    public function executeStepRoutine($step, $workflowExecutionId)
    {
        $node = $step['node'];
        $nodeName = $node['data']['name'];

        $stepRunner = call_user_func($this->stepRunnerFactory, $nodeName, $workflowExecutionId);

        $executionContext = $this->executionContextRegistry->getExecutionContext($workflowExecutionId);

        if (is_null($stepRunner)) {
            $message = sprintf(
                self::LOG_PREFIX . ' Node runner not found: %s',
                $nodeName
            );

            $this->logger->error($message);

            throw new \Exception(esc_html($message));
        }

        $this->logger->debug(
            sprintf(
                self::LOG_PREFIX . '   - Workflow %d: Setting up step | Slug: %s',
                $executionContext->getVariable('global.workflow.id'),
                $node['data']['slug']
            )
        );

        $stepRunner->setup($step);
    }

    public function executeAsyncStepRoutine($args)
    {
        try {
            if (is_null($args)) {
                $message = self::LOG_PREFIX . ' Async node runner error, no args found';

                throw new \Exception(esc_html($message));
            }

            $originalArgs = $args;

            if (ScheduledActionModel::argsAreOnNewFormat($args)) {
                // New format, when the args are saved in the wp_ppfuture_workflow_scheduled_steps table.
                $nodeName = $args['stepName'];
                $scheduledStepModel = new WorkflowScheduledStepModel();
                $scheduledStepModel->loadByActionId($this->currentAsyncActionId);
                $args = $scheduledStepModel->getArgs();
                $workflowExecutionId = $args['runtimeVariables']['global']['workflow']['execution_id'];
            } else {
                // Old format, when the args were saved directly in the actionsscheduler_actions table.
                if (! isset($args['step']['node']['data']['name'])) {
                    $message = self::LOG_PREFIX . ' Async node runner error, no step name found';

                    $this->logger->error($message);

                    return;
                }

                $nodeName = $args['step']['node']['data']['name'];

                $workflowExecutionId = '1_' . $this->generateUniqueId();
            }

            $args['actionId'] = $this->currentAsyncActionId;
            $args['workflowId'] = $originalArgs['workflowId'];

            $stepRunner = call_user_func($this->stepRunnerFactory, $nodeName, $workflowExecutionId);

            $workflow = new WorkflowModel();
            $workflow->load($originalArgs['workflowId']);

            $step = $workflow->getPartialRoutineTreeFromNodeId($originalArgs['stepId']);

            if (empty($step)) {
                throw new \Exception('Step not found');
            }

            $this->logger->debug(
                sprintf(
                    self::LOG_PREFIX . '   - Workflow %1$d: Executing async step %2$s on action %3$d',
                    $originalArgs['workflowId'],
                    $step['node']['data']['slug'] ?? 'unknown',
                    $args['actionId']
                )
            );

            $stepRunner->actionCallback($args, $originalArgs);
        } catch (Throwable $e) {
            $this->logger->error(sprintf(self::LOG_PREFIX . ' Async node runner error: %s. File: %s:%d', $e->getMessage(), $e->getFile(), $e->getLine()));
        }
    }

    public function onWorkflowUpdated($workflowId, $newPost, $oldPost)
    {
        if ($newPost->post_type !== Module::POST_TYPE_WORKFLOW) {
            return;
        }

        // Ignore if the status is the same
        if ($oldPost->post_status === $newPost->post_status) {
            return;
        }

        if ($newPost->post_status === 'publish') {
            $this->onWorkflowPublished($workflowId);
        } else {
            $this->onWorkflowUnpublished($workflowId);
        }
    }

    public function onWorkflowPublished($workflowId)
    {
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelWorkflowScheduledActions($workflowId);
    }

    public function onWorkflowUnpublished($workflowId)
    {
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelWorkflowScheduledActions($workflowId);
    }

    public function unscheduleRecurringStepAction($workflowId, $actionUIDHash)
    {
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelRecurringScheduledActions($workflowId, $actionUIDHash);
    }

    public function getEngineExecutionId(): string
    {
        return $this->engineExecutionId;
    }

    public function generateUniqueId(): string
    {
        return wp_generate_uuid4();
    }

    private function getPublishedWorkflowsIds(): array
    {
        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsIds();

        return $workflows;
    }

    private function getAllStepTypes(): array
    {
        return $this->stepTypesModel->getAllStepTypesByType();
    }

    /**
     * Determines the execution environment of the workflow engine.
     *
     * @return string The environment context (cli, admin, cron, ajax, or frontend)
     */
    private function getEngineExecutionEnvironment(): string
    {
        if (defined('WP_CLI')) {
            return 'cli';
        }

        if (is_admin()) {
            return 'admin';
        }

        if (defined('DOING_CRON')) {
            return 'cron';
        }

        if (defined('DOING_AJAX')) {
            return 'ajax';
        }

        return 'frontend';
    }
}
