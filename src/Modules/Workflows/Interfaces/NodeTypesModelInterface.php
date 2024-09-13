<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeTypesModelInterface
{
    public function getTriggerNodes(): array;

    public function getActionNodes(): array;

    public function getAdvancedNodes(): array;

    public function convertInstancesToArray($instances, $type): array;

    public function getCategories(): array;

    public function getAllNodeTypesIndexedByName(): array;

    public function getNodeType(string $name): ?NodeTypeInterface;

    public function getStrings(): array;

    public function getAllNodeTypes(): array;

    public function getAllNodeTypesByType(): array;
}
