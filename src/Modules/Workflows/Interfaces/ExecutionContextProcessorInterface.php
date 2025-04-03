<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface ExecutionContextProcessorInterface
{
    public function getType(): string;

    public function process(string $value, array $parameters);
}
