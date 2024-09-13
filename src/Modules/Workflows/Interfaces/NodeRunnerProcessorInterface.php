<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeRunnerProcessorInterface
{
    public function setup(array $step, callable $actionCallback, array $contextVariables = []): void;

    public function runNextSteps(array $step, array $contextVariables): void;

    public function getNextSteps(array $step);

    public function getNodeFromStep(array $step);

    public function getSlugFromStep(array $step);

    public function getVariableValueFromContextVariables(string $variableName, array $contextVariables);

    public function getNodeSettings(array $node);

    public function getWorkflowIdFromContextVariables(array $contextVariables);

    public function logError(string $message, int $workflowId, array $step);

    public function triggerCallbackIsRunning(array $contextVariables): void;
}
