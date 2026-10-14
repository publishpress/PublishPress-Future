<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

class DatetimeResolver extends ScalarResolver
{
    public function __construct(string $variable)
    {
        parent::__construct('datetime', $variable);
    }
}
