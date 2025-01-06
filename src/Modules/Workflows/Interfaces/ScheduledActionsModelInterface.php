<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface ScheduledActionsModelInterface
{
    public function deleteOrphanWorkflowArgs(): void;

    public function cancelWorkflowScheduledActions(int $workflowId): void;

    public function deleteExpiredScheduledSteps(): void;
}
