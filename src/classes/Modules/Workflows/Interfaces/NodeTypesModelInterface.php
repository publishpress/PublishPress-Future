<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface NodeTypesModelInterface
{
    public function getTriggers(): array;

    public function getActions(): array;

    public function getFlows(): array;

    public function getCategories(): array;
}
