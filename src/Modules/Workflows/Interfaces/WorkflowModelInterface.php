<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

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

    public function publish();

    public function unpublish();

    public function isActive(): bool;

    public function getModifiedAt(): string;

    public function save();

    public function delete();

    public function getFlow(): array;

    public function setFlow(array $flow);

    public function setScreenshotFromBase64(string $dataImage);

    public function setScreenshotFromFile(string $filePath);

    public function setDebugRayShowQueries(bool $debugRayShowQueries);

    public function setDebugRayShowEmails(bool $debugRayShowEmails);

    public function setDebugRayShowWordPressErrors(bool $debugRayShowWordPressErrors);

    public function setDebugRayShowCurrentRunningStep(bool $debugRayShowCurrentRunningStep);

    public function isDebugRayShowQueriesEnabled(): bool;

    public function isDebugRayShowEmailsEnabled(): bool;

    public function isDebugRayShowWordPressErrorsEnabled(): bool;

    public function isDebugRayShowCurrentRunningStepEnabled(): bool;

    public function createNew($reuseAutoDraft = true): int;

    public function getTriggerNodes(): array;

    public function getEdges(): array;

    public function getRoutineTree(array $nodeTypes): array;

    public function getScreenshotUrl($size = 'full'): string;

    public function convertLegacyScreenshots(): void;

    public function getNodeById(string $nodeId): array;

    public function getNodes(): array;

    public function getPartialRoutineTreeFromNodeId(string $nodeId): array;
}
