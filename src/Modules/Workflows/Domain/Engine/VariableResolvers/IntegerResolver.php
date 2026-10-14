<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

class IntegerResolver extends ScalarResolver
{
    public function __construct(int $variable)
    {
        parent::__construct(
            'integer',
            $variable,
            static function ($value) {
                return (int) $value;
            }
        );
    }
}
