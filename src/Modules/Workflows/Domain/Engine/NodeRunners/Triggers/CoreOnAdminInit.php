<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnAdminInit as NodeTypeCoreOnAdminInit;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class CoreOnAdminInit implements NodeTriggerRunnerInterface
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
        return NodeTypeCoreOnAdminInit::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }
}
