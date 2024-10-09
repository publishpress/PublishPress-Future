<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit as NodeTypeCoreOnInit;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class CoreOnInit implements NodeTriggerRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreOnInit::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);
        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }
}
