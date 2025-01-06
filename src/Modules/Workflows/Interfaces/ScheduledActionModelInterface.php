<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface ScheduledActionModelInterface
{
    public function getActionId(): int;

    public function getHook(): string;

    public function getStatus(): string;

    public function getPriority(): int;

    public function setArgs(array $args): void;

    public function getArgs(): array;

    public function loadByActionId(int $id): void;

    public function update(): void;

    public function setActionIdOnArgs(): void;

    public static function argsAreOnNewFormat(array $args): bool;

    public function cancel(): void;

    public function complete(): void;
}
