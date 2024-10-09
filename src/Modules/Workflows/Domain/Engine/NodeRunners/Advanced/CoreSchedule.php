<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class CoreSchedule implements AsyncNodeRunnerInterface
{
    /**
     * @var AsyncNodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        AsyncNodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);
        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }

    public function actionCallback(array $expandedArgs, array $originalArgs)
    {
        $this->nodeRunnerProcessor->actionCallback($expandedArgs, $originalArgs);
    }
}
