<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeTriggerRunnerInterface
{
    public function setup(int $workflowId, array $step): void;
}
