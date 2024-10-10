<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit as NodeTypeCoreOnInit;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class CoreOnInit implements NodeTriggerRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $runtimeVariablesHandler;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $runtimeVariablesHandler
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->runtimeVariablesHandler = $runtimeVariablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreOnInit::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;

        $this->hooks->addAction(FreeHooksAbstract::ACTION_INIT, [$this, 'triggerCallback'], 13);
    }

    public function triggerCallback()
    {
        $this->nodeRunnerProcessor->triggerCallbackIsRunning();
        $this->nodeRunnerProcessor->runNextSteps($this->step);
    }
}
