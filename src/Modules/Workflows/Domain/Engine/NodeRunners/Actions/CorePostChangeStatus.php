<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;

class CorePostChangeStatus implements NodeRunnerInterface
{
    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        // This method is intentionally left empty.
        // The functionality is implemented in the Pro version of the plugin.
    }
}
