<?php
namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface NodeTriggerRunnerInterface
{
    public function setup(array $node, array $routineTree = []);
}
