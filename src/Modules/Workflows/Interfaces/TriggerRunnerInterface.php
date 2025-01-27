<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface TriggerRunnerInterface
{
    public function setup(int $workflowId, array $step): void;
}
