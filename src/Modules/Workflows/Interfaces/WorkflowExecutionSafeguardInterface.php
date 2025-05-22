<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface WorkflowExecutionSafeguardInterface
{
    public function detectInfiniteLoop(
        ?ExecutionContextInterface $executionContext = null,
        array $step,
        string $uniqueId = '',
    ): bool;

    public function preventDuplicateExecution(string $uniqueId): bool;

    public function generateUniqueExecutionIdentifier(array $elements): string;
}
