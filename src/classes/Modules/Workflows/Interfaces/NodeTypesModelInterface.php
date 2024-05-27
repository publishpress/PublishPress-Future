<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface NodeTypesModelInterface
{
    public function getTriggerNodes(): array;

    public function getActionNodes(): array;

    public function getAdvancedNodes(): array;

    public function convertInstancesToArray($instances, $type): array;

    public function getCategories(): array;
}
