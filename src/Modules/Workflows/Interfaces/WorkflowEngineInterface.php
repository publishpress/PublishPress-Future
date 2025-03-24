<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

use Closure;

interface WorkflowEngineInterface
{
    public function start();

    public function setCurrentAsyncActionId($actionId);

    public function getCurrentAsyncActionId(): int;

    /**
     * @since 4.4.1
     */
    public function getEngineExecutionId(): string;

    /**
     * @since 4.4.1
     */
    public function prepareExecutionContextForWorkflow(
        string $workflowExecutionId,
        WorkflowModelInterface $workflowModel
    ): void;

    /**
     * @since 4.4.1
     */
    public function prepareExecutionContextForTrigger(
        string $workflowExecutionId,
        array $triggerStep
    ): void;

    /**
     * @since 4.4.1
     */
    public function generateUniqueId(): string;
}
