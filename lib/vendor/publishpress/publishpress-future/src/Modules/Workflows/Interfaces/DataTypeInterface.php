<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface DataTypeInterface
{
    public function getName(): string;

    public function getLabel(): string;

    public function getDescription(): string;
}
