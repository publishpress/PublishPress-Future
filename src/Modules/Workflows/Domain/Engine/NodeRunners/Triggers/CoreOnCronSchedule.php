<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnCronSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnCronSchedule implements NodeTriggerRunnerInterface
{
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
        // This method is intentionally left empty.
        // The functionality is implemented in the Pro version of the plugin.
    }
}
