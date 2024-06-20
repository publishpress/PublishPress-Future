<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface WorkflowsModelInterface
{
    public function getPublishedWorkflowsIds(): array;

    public function hasCreatedSampleWorkflows(): bool;

    public function createSampleWorkflows(array $samples): void;
}
