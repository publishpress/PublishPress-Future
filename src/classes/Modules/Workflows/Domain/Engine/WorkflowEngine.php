<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerMapperInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowsModel;

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
     * @var NodeRunnerMapperInterface
     */
    private $nodeRunnerMapper;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        NodeRunnerMapperInterface $nodeRunnerMapper
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->nodeRunnerMapper = $nodeRunnerMapper;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);
        $this->hooks->addAction(HooksAbstract::ACTION_EXECUTE_NODE, [$this, 'executeNodeRoutine'], 10, 2);
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

            $triggerNodes = $workflow->getTriggerNodes();

            $routineTree = $workflow->getRoutineTree($nodeTypes);

            $triggerRunner = null;
            foreach ($triggerNodes as $triggerNode) {
                $triggerName = $triggerNode['data']['name'];
                $triggerId = $triggerNode['id'];

                $triggerRunner = $this->nodeRunnerMapper->mapNodeToRunner($triggerName);

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

                // Setup the trigger
                $triggerRunner->setup($triggerNode, $routineTree[$triggerId]);
            }
        }
    }

    public function executeNodeRoutine($step, $input)
    {
        $node = $step['node'];
        $nodeName = $node['data']['name'];

        $nodeRunner = $this->nodeRunnerMapper->mapNodeToRunner($nodeName);

        if (is_null($nodeRunner)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PublishPress Future Pro] Node runner not found: {$nodeName}");
            }

            return;
        }

        $nodeRunner->setup($step, $input);
    }
}
