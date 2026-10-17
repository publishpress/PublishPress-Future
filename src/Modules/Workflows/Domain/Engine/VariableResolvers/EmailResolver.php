<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

class EmailResolver extends ScalarResolver
{
    public function __construct(string $variable)
    {
        parent::__construct(
            'email',
            $variable,
            static function ($value) {
                return (string) $value;
            }
        );
    }
}
