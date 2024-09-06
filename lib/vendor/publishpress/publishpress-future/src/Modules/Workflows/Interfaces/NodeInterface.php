<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface NodeInterface
{
    public function load(array $nodeData): bool;

    public function getNextNodes(): array;
}
