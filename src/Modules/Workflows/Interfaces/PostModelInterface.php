<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface PostModelInterface
{
    public function load(int $id): bool;

    public function getId(): int;

    public function getTitle(): string;

    public function getValidWorkflowsWithManualTrigger(int $postId): array;

    public function getManuallyEnabledWorkflows(): array;

    public function setManuallyEnabledWorkflows(array $workflowIds): void;

    public function addManuallyEnabledWorkflow(int $workflowId): void;

    public function removeManuallyEnabledWorkflow(int $workflowId): void;

    public function getManuallyEnabledWorkflowsSchedule(int $workflowId): array;

    public function getPostObject(): \WP_Post;
}
