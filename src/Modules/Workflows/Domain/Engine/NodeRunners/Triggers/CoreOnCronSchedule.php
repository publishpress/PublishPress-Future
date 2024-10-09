<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnCronSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class CoreOnCronSchedule implements NodeTriggerRunnerInterface
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
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);

        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }
}
