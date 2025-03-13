<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface RuntimeVariablesHelperInterface
{
    public function getType(): string;

    public function execute(string $value, array $parameters);
}
