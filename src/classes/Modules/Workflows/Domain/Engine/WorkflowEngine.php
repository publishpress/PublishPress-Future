<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;

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
    }

    public function start()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsIds();

        $nodeTypes = [
            "action" => $this->nodeTypesModel->getActions(),
            "trigger" => $this->nodeTypesModel->getTriggers(),
            "flow" => $this->nodeTypesModel->getFlows(),
        ];

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

                $triggerRunner = call_user_func($this->nodeRunnerFactory, $triggerName);

                if (is_null($triggerRunner)) {
                    if (defined('WP_DEBUG') && WP_DEBUG) {
                        error_log("[PublishPress Future Pro] Trigger not found: $triggerName");
                    }

                    continue;
                }

                // Ignore if there is no routine tree for this trigger
                if (! isset($routineTree[$triggerId])) {
                    continue;
                }

                // Update the trigger global variables
                $globalVariables['trigger'] = [
                    'id' => $triggerId,
                    'name' => $triggerName,
                    'label' => $triggerNode['data']['label'],
                ];

                $contextVariables = [
                    'global' => $globalVariables,
                ];

                // Setup the trigger
                $triggerRunner->setup($workflowId, $routineTree[$triggerId], $contextVariables);
            }
        }
    }



    public function executeNodeRoutine($step, $contextVariables)
    {
        $node = $step['node'];
        $nodeName = $node['data']['name'];

        $nodeRunner = call_user_func($this->nodeRunnerFactory, $nodeName);

        if (is_null($nodeRunner)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PublishPress Future Pro] Node runner not found: {$nodeName}");
            }

            return;
        }

        $nodeRunner->setup($step, $contextVariables);
    }

    public function executeAsyncNodeRoutine($args)
    {
        $nodeRunner = call_user_func($this->nodeRunnerFactory, $args['step']['node']['data']['name']);
        $nodeRunner->actionCallback($args);
    }

    public function unscheduleRecurringNodeAction($hook, $args)
    {
        $this->cron->clearScheduledAction($hook, [$args]);
    }

    public function getVariablesHandler(): WorkflowVariablesHandlerInterface
    {
        return $this->variablesHandler;
    }
}
