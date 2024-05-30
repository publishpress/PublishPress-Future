<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeTriggerRunnerInterface
{
    public function setup(int $workflowId, array $step, array $contextVariables = []): void;
}
