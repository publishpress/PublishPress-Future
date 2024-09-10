<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface AsyncNodeRunnerProcessorInterface extends NodeRunnerProcessorInterface
{
    public function actionCallback(array $compactedArgs, array $originalArgs);

    public function compactArguments(array $step, array $contextVariables): array;

    public function expandArguments(array $compactArguments): array;

    public function cancelScheduledStep(int $actionId, array $originalArgs): void;

    public function completeScheduledStep(int $actionId): void;

    public function cancelWorkflowScheduledActions(int $workflowId): void;
}
