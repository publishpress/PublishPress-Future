<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnCronSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class CoreOnCronSchedule implements NodeTriggerRunnerInterface
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

    /**
     * The default interval in seconds that the setup should be skipped.
     *
     * @var int
     */
    public const DEFAULT_SETUP_INTERVAL = 5;

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }
}
