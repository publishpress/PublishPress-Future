<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

class StringResolver extends ScalarResolver
{
    public function __construct(string $variable)
    {
        parent::__construct(
            'string',
            $variable,
            static function ($value) {
                return (string) $value;
            }
        );
    }
}
