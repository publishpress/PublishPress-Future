<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\IfElse as NodeTypeIfElse;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;

class IfElse implements NodeRunnerInterface
{
    public static function getNodeTypeName(): string
    {
        return NodeTypeIfElse::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        // This method is intentionally left empty.
        // The functionality is implemented in the Pro version of the plugin.
    }
}
