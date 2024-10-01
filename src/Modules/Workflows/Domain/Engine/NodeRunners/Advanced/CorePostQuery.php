<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class CorePostQuery implements NodeRunnerInterface
{

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor
    ) {
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
}
