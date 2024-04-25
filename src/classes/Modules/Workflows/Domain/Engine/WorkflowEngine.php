<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeMapperInterface;
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
     * @var NodeMapperInterface
     */
    private $nodeMapper;

    public function __construct(
        HookableInterface $hooks,
        NodeTypesModelInterface $nodeTypesModel,
        NodeMapperInterface $nodeMapper
    ) {
        $this->hooks = $hooks;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->nodeMapper = $nodeMapper;

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_LOAD);
    }

    public function start()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_START);

        $workflowsModel = new WorkflowsModel();
        $workflows = $workflowsModel->getPublishedWorkflowsIds();

        // Setup the workflow triggers
        foreach ($workflows as $workflowId) {
            $workflow = new WorkflowModel();
            $workflow->load($workflowId);

            $triggerNodes = $workflow->getTriggerNodes();

            $currentTrigger = null;
            foreach ($triggerNodes as $triggerNode) {
                $triggerName = $triggerNode['data']['name'];
                $currentTrigger = $this->nodeMapper->mapNodeToInstance($triggerName);

                if (is_null($currentTrigger)) {
                    if (defined('WP_DEBUG') && WP_DEBUG) {
                        error_log("[PublishPress Future Pro] Trigger not found: $triggerName");
                    }

                    continue;
                }

                $currentTrigger->setup($triggerNode);
            }
        }
    }
}
