<?php
namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeRunnerInterface
{
    public function setup(array $step, array $input = [], array $globalVariables = []): void;
}
