<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use Closure;
use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowScheduledStepModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Modules\Workflows\Module;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowModelInterface;
use Throwable;

class WorkflowEngine implements WorkflowEngineInterface
{
    const LOG_PREFIX = '[WF Engine]';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    /**
     * @var \Closure
     */
    private $nodeRunnerFactory;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var int
     */
    private $currentAsyncActionId;

    /**
     * @var WorkflowModelInterface
     */
    private $currentRunningWorkflow;

    /**
     * @var array
     */
    private $currentExecutionTrace;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        \Closure $nodeRunnerFactory,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->nodeRunnerFactory = $nodeRunnerFactory;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);

        $this->hooks->addAction(
            HooksAbstract::ACTION_EXECUTE_NODE,
            [$this, 'executeNodeRoutine']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ASYNC_EXECUTE_NODE,
            [$this, "executeAsyncNodeRoutine"],
            10
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_UNSCHEDULE_RECURRING_NODE_ACTION,
            [$this, "unscheduleRecurringNodeAction"],
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

        $currentUser = wp_get_current_user();
        $context = $this->getContext();
        $this->logger->debug(
            sprintf(
                self::LOG_PREFIX . ' Starting engine | User: %s | Context: %s',
                ($currentUser->ID > 0) ? "ID {$currentUser->ID}" : 'unknown',
                $context
            )
        );

        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsIds();

        $nodeTypes = $this->nodeTypesModel->getAllNodeTypesByType();

        // Setup the workflow triggers
        foreach ($workflows as $workflowId) {
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

            $this->currentRunningWorkflow = $workflow;

            $this->variablesHandler->setAllVariables([]);

            $triggerNodes = $workflow->getTriggerNodes();

            $routineTree = $workflow->getRoutineTree($nodeTypes);

            $triggerRunner = null;

            $globalVariables = [
                'user' => new UserResolver($currentUser),
                'site' => new SiteResolver(),
                'workflow' => new WorkflowResolver(
                    [
                        'id' => $workflow->getId(),
                        'title' => $workflow->getTitle(),
                        'description' => $workflow->getDescription(),
                        'modified_at' => $workflow->getModifiedAt(),
                        'steps' => $workflow->getNodes(),
                    ]
                ),
                'execution_id' => $this->getExecutionId(),
            ];

            foreach ($triggerNodes as $triggerNode) {
                $triggerName = $triggerNode['data']['name'];
                $triggerId = $triggerNode['id'];
                $nodeType = $this->nodeTypesModel->getNodeType($triggerName);

                if (! $nodeType) {
                    continue;
                }

                /** @var NodeRunnerInterface $triggerRunner */
                $triggerRunner = call_user_func($this->nodeRunnerFactory, $triggerName);

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

                // Reset the execution trace
                $this->currentExecutionTrace = [];

                $globalVariables['trigger'] = new NodeResolver(
                    [
                        'id' => $triggerId,
                        'name' => $triggerName,
                        'label' => $nodeType->getLabel(),
                        'activation_timestamp' => date('Y-m-d H:i:s'),
                        'slug' => $triggerNode['data']['slug'],
                    ]
                );

                $this->variablesHandler->setAllVariables([
                    'global' => $globalVariables,
                ]);

                // Setup the trigger
                $this->logger->debug(
                    sprintf(
                        self::LOG_PREFIX . '   - Setting up trigger | Slug: %s',
                        $triggerNode['data']['slug']
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

    public function setCurrentAsyncActionId($actionId)
    {
        $this->currentAsyncActionId = $actionId;
    }

    public function getCurrentAsyncActionId(): int
    {
        return (int) $this->currentAsyncActionId;
    }

    public function executeNodeRoutine($step)
    {
        $node = $step['node'];
        $nodeName = $node['data']['name'];

        $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

        if (is_null($nodeRunner)) {
            $message = sprintf(
                self::LOG_PREFIX . ' Node runner not found: %s',
                $nodeName
            );

            $this->logger->error($message);

            throw new \Exception($message);
        }

        $this->logger->debug(
            sprintf(
                self::LOG_PREFIX . '   - Workflow %d: Setting up step | Slug: %s',
                $this->currentRunningWorkflow->getId(),
                $node['data']['slug']
            )
        );

        $nodeRunner->setup($step);
    }

    public function executeAsyncNodeRoutine($args)
    {
        try {

            if (is_null($args)) {
                $message = self::LOG_PREFIX . ' Async node runner error, no args found';

                throw new \Exception($message);
            }

            $originalArgs = $args;

            if (ScheduledActionModel::argsAreOnNewFormat($args)) {
                // New format, when the args are saved in the wp_ppfuture_workflow_scheduled_steps table.
                $nodeName = $args['stepName'];
                $scheduledStepModel = new WorkflowScheduledStepModel();
                $scheduledStepModel->loadByActionId($this->currentAsyncActionId);
                $args = $scheduledStepModel->getArgs();
            } else {
                // Old format, when the args were saved directly in the actionsscheduler_actions table.
                if (! isset($args['step']['node']['data']['name'])) {
                    $message = self::LOG_PREFIX . ' Async node runner error, no step name found';

                    $this->logger->error($message);

                    return;
                }

                $nodeName = $args['step']['node']['data']['name'];
            }
            $args['actionId'] = $this->currentAsyncActionId;

            $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

            $step = $this->currentRunningWorkflow->getPartialRoutineTreeFromNodeId($args['step']['nodeId']);

            $this->logger->debug(
                sprintf(
                    self::LOG_PREFIX . '   - Workflow %1$d: Executing async step %2$s on action %3$d',
                    $this->currentRunningWorkflow->getId(),
                    $step['node']['data']['slug'],
                    (int) $this->currentAsyncActionId
                )
            );

            $nodeRunner->actionCallback($args, $originalArgs);
        } catch (Throwable $e) {
            $this->logger->error(sprintf(self::LOG_PREFIX . ' Async node runner error: %s', $e->getMessage()));
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

    public function unscheduleRecurringNodeAction($workflowId, $stepId)
    {
        $scheduledActionsModel = new ScheduledActionsModel();
        $scheduledActionsModel->cancelRecurringScheduledActions($workflowId, $stepId);
    }

    public function getVariablesHandler(): RuntimeVariablesHandlerInterface
    {
        return $this->variablesHandler;
    }

    public function getCurrentExecutionTrace(): array
    {
        return $this->currentExecutionTrace;
    }

    public function getCurrentRunningWorkflow(): WorkflowModelInterface
    {
        return $this->currentRunningWorkflow;
    }

    private function getContext(): string
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

    private function getExecutionId(): string
    {
        return wp_generate_uuid4();
    }
}
