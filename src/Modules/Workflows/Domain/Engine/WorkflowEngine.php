<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionModel;
use PublishPress\Future\Modules\Workflows\Models\ScheduledActionsModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowScheduledStepModel;
use PublishPress\Future\Modules\Workflows\Models\WorkflowsModel;
use PublishPress\Future\Modules\Workflows\Module;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;

use function PublishPress\Future\logError;

class WorkflowEngine implements WorkflowEngineInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var NodeTypesModelInterface
     */
    private $nodeTypesModel;

    /**
     * @var \Closure
     */
    private $nodeRunnerFactory;

    /**
     * @var WorkflowVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var int
     */
    private $currentAsyncActionId;

    public function __construct(
        HookableInterface $hooks,
        CronInterface $cron,
        NodeTypesModelInterface $nodeTypesModel,
        \Closure $nodeRunnerFactory,
        WorkflowVariablesHandlerInterface $variablesHandler
    ) {
        $this->hooks = $hooks;
        $this->cron = $cron;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->nodeRunnerFactory = $nodeRunnerFactory;
        $this->variablesHandler = $variablesHandler;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);

        $this->hooks->addAction(
            HooksAbstract::ACTION_EXECUTE_NODE,
            [$this, 'executeNodeRoutine'],
            10,
            3
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
        try {
            $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

            $workflowsModel = new WorkflowsModel();
            $workflows = $workflowsModel->getPublishedWorkflowsIds();

            $nodeTypes = $this->nodeTypesModel->getAllNodeTypesByType();

            // Setup the workflow triggers
            foreach ($workflows as $workflowId) {
                $workflow = new WorkflowModel();
                $workflow->load($workflowId);

                $globalVariables = $this->variablesHandler->getGlobalVariables($workflow);

                $triggerNodes = $workflow->getTriggerNodes();

                $routineTree = $workflow->getRoutineTree($nodeTypes);

                $triggerRunner = null;
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

                    // Update the trigger global variables
                    $globalVariables['trigger'] = new NodeResolver(
                        [
                            'id' => $triggerId,
                            'name' => $triggerName,
                            'label' => $nodeType->getLabel(),
                            'activation_timestamp' => date('Y-m-d H:i:s'),
                            'slug' => $triggerNode['data']['slug'],
                        ]
                    );

                    $contextVariables = [
                        'global' => $globalVariables,
                    ];

                    // Setup the trigger
                    $triggerRunner->setup($workflowId, $routineTree[$triggerId], $contextVariables);
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

    public function executeNodeRoutine($step, $contextVariables)
    {
        try {
            $node = $step['node'];
            $nodeName = $node['data']['name'];

            $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

            if (is_null($nodeRunner)) {
                throw new \Exception("Node runner not found: $nodeName");
            }

            $nodeRunner->setup($step, $contextVariables);
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

    public function getVariablesHandler(): WorkflowVariablesHandlerInterface
    {
        return $this->variablesHandler;
    }
}
