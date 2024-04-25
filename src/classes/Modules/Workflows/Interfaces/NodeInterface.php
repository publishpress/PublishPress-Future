<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface NodeInterface
{
    public function load(array $nodeData): bool;

    public function getNextNodes(): array;
}
