<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeRunnerInterface
{
    /**
     * The node type name.
     */
    public static function getNodeTypeName(): string;

    public function setup(array $step, array $contextVariables = []): void;
}
