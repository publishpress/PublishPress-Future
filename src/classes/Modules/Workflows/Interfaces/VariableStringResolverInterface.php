<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface VariableStringResolverInterface
{
    public function getType(): string;

    public function getValueAsString($property = ''): string;
}
