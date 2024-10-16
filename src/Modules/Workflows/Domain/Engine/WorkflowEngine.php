<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\ArrayResolver;
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

use function PublishPress\Future\logError;

class WorkflowEngine implements WorkflowEngineInterface
{
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

        $this->hooks->addAction(
            HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP,
            [$this, "onRunningStep"]
        );
    }

    public function start()
    {
        try {
            $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

            $this->logger->debug('Starting workflow engine');

            $workflowsModel = new WorkflowsModel();
            $workflows = $workflowsModel->getPublishedWorkflowsIds();

            $nodeTypes = $this->nodeTypesModel->getAllNodeTypesByType();

            $currentUser = wp_get_current_user();

            // Setup the workflow triggers
            foreach ($workflows as $workflowId) {
                /** @var WorkflowModelInterface $workflow */
                $workflow = new WorkflowModel();
                $workflow->load($workflowId);

                $this->logger->debug(
                    sprintf(
                        // translators: %d is the workflow ID, %s is the workflow title
                        __('Starting workflow [%d] %s', 'post-expirator'),
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
                ];

                foreach ($triggerNodes as $triggerNode) {
                    $triggerName = $triggerNode['data']['name'];
                    $triggerId = $triggerNode['id'];
                    $nodeType = $this->nodeTypesModel->getNodeType($triggerName);

                    /** @var NodeRunnerInterface $triggerRunner */
                    $triggerRunner = call_user_func($this->nodeRunnerFactory, $triggerName);

                    if (is_null($triggerRunner)) {
                        logError(
                            sprintf(
                                // translators: %s is the trigger name
                                __('Trigger not found: %s', 'post-expirator'),
                                $triggerName
                            )
                        );

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
                    $triggerRunner->setup($workflowId, $routineTree[$triggerId]);
                }
            }
        } catch (Exception $e) {
            logError("Workflow engine error", $e);
        }
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
        try {
            $node = $step['node'];
            $nodeName = $node['data']['name'];

            $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

            if (is_null($nodeRunner)) {
                throw new \Exception("Node runner not found: $nodeName");
            }

            $nodeRunner->setup($step);
        } catch (Exception $e) {
            logError("Node runner error", $e);
        }
    }

    public function executeAsyncNodeRoutine($args)
    {
        if (is_null($args)) {
            logError("Async node runner error", null, true);

            return;
        }

        $originalArgs = $args;

        try {
            if (ScheduledActionModel::argsAreOnNewFormat($args)) {
                // New format, when the args are saved in the wp_ppfuture_workflow_scheduled_steps table.
                $nodeName = $args['stepName'];
                $scheduledStepModel = new WorkflowScheduledStepModel();
                $scheduledStepModel->loadByActionId($this->currentAsyncActionId);
                $args = $scheduledStepModel->getArgs();
            } else {
                // Old format, when the args were saved directly in the actionsscheduler_actions table.

                if (! isset($args['step']['node']['data']['name'])) {
                    logError("Async node runner error", null, true);

                    return;
                }

                $nodeName = $args['step']['node']['data']['name'];
            }
            $args['actionId'] = $this->currentAsyncActionId;

            $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);
            $nodeRunner->actionCallback($args, $originalArgs);
        } catch (Exception $e) {
            logError("Async node runner error", $e);
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

    public function onRunningStep(array $step)
    {
        if (empty($this->currentRunningWorkflow)) {
            return;
        }

        if (! $this->currentRunningWorkflow->isDebugRayShowCurrentRunningStepEnabled()) {
            return;
        }

        if (! function_exists('ray')) {
            return;
        }

        $stepSlug = $step['node']['data']['slug'];

        $this->currentExecutionTrace[] = $stepSlug;

        // Update the trace global variable.
        $globalVariables = $this->variablesHandler->getVariable('global');
        $globalVariables['trace'] = new ArrayResolver($this->currentExecutionTrace);
        $this->variablesHandler->setVariable('global', $globalVariables);

        // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
        ray($stepSlug)->label('Current running step');
    }
}
