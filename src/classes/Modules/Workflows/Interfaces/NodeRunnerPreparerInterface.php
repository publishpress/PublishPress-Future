<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface NodeRunnerPreparerInterface
{
    public function setup(array $step, callable $actionCallback, array $input = [], array $globalVariables = []): void;

    public function runNextSteps(array $step, array $input, array $globalVariables): void;

    public function getNextSteps(array $step);

    public function getNodeFromStep(array $step);

    public function getNodeSettings(array $node);

    public function getWorkflowIdFromGlobalVariables(array $globalVariables);

    public function logError(string $message, int $workflowId, array $step);
}
