<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;

class CoreSchedule implements AsyncNodeRunnerInterface
{
    /**
     * @var AsyncNodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    public function __construct(AsyncNodeRunnerProcessorInterface $nodeRunnerProcessor)
    {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }

    public function actionCallback(array $expandedArgs, array $originalArgs)
    {
        $this->nodeRunnerProcessor->actionCallback($expandedArgs, $originalArgs);
    }
}
