<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface WorkflowModelInterface
{
    public function load(int $id): bool;

    public function getId(): int;

    public function getTitle(): string;

    public function setTitle(string $title);

    public function getDescription(): string;

    public function setDescription(string $description);

    public function getStatus(): string;

    public function setStatus(string $status);

    public function save();

    public function delete();

    public function getFlow(): array;

    public function setFlow(array $flow);

    public function setScreenshot(string $baseUrl);

    public function createNew($reuseAutoDraft = true): int;

    public function getTriggerNodes(): array;

    public function getARTFromFlow(): array;
}
