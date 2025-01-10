<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface ScheduledActionsModelInterface
{
    public function deleteOrphanWorkflowArgs(): void;

    public function cancelWorkflowScheduledActions(int $workflowId): void;

    public function cancelRecurringScheduledActions(int $workflowId, string $stepId): void;

    public function deleteExpiredScheduledSteps(): void;

    public function hasRowWithActionUIDHash(string $actionUIDHash): bool;

    /**
     * @since 4.3.1
     */
    public function getActionIdByActionUIDHash(string $actionUIDHash): ?int;

    /**
     * @since 4.3.1
     */
    public function cancelActionById(int $actionId): void;
}
