<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

/**
 * @since 4.3.1
 */
interface AsyncStepProcessorInterface extends StepProcessorInterface
{
    public function actionCallback(array $compactedArgs, array $originalArgs);

    public function compactArguments(array $step): array;

    public function expandArguments(array $compactArguments): array;

    public function cancelScheduledStep(int $actionId, array $originalArgs): void;

    public function completeScheduledStep(int $actionId): void;

    public function cancelWorkflowScheduledActions(int $workflowId): void;
}
