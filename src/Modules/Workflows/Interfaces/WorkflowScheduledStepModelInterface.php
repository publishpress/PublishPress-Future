<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface WorkflowScheduledStepModelInterface
{
    public function setActionId(int $actionId): void;

    public function getActionId(): int;

    public function setWorkflowId(int $workflowId): void;

    public function getWorkflowId(): int;

    public function setStepId(string $stepId): void;

    public function getStepId(): string;

    public function setActionUID(string $actionUID): void;

    public function getActionUID(): string;

    public function getActionUIDHash(): string;

    public function setIsRecurring(bool $isRecurring): void;

    public function getIsRecurring(): bool;

    public function setRepeatUntil(string $repeatUntil): void;

    public function getRepeatUntil(): string;

    public function setRepeatTimes(int $repeatTimes): void;

    public function getRepeatTimes(): int;

    public function setRepeatUntilDate(string $repeatUntilDate): void;

    public function getRepeatUntilDate(): string;

    public function setRunCount(int $runCount): void;

    public function getRunCount(): int;

    public function setLastRunAt(string $lastRunAt): void;

    public function getLastRunAt(): string;

    public function setIsCompressed(bool $isCompressed): void;

    public function getIsCompressed(): bool;

    public function setArgs(array $args): void;

    public function getArgs(): array;

    public function insert(): bool;

    public function update(): bool;

    public function delete(): bool;

    public function loadByActionId(int $id): void;

    public function expectCompressedArguments(): bool;

    public function incrementRunCount(): void;

    public function updateLastRunAt(): void;

    public function resetRunData(): void;

    public function markAsFinished(): void;

    public function isFinished(): bool;

    public static function getMetaIsFinished(int $workflowId, string $actionUIDHash): bool;

    public static function getMetaRunCount(int $workflowId, string $actionUIDHash): int;
}
