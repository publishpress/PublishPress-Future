<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeRunnerInterface
{
    /**
     * The node type name.
     */
    public static function getNodeTypeName(): string;

    /**
     * Setup the node runner with the step and context variables, and
     * execute the next steps if needed.
     */
    public function setup(array $step): void;
}
