<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeRunnerProcessorInterface
{
    public function setup(
        array $step,
        callable $actionCallback
    ): void;

    public function runNextSteps(array $step): void;

    public function getNextSteps(array $step);

    public function getNodeFromStep(array $step);

    public function getSlugFromStep(array $step);

    public function getNodeSettings(array $node);

    /**
     * @deprecated Use the logger instead
     */
    public function logError(string $message, int $workflowId, array $step);

    public function triggerCallbackIsRunning(): void;

    public function prepareLogMessage(string $message, ...$args): string;

    public function executeSafelyWithErrorHandling(array $step, callable $callback, ...$args): void;
}
