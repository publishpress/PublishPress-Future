<?php
namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface WorkflowTriggerInterface
{
    public function setup(array $node, string $hookName, array $routineTree = []);
}
