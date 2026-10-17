<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

class BooleanResolver extends ScalarResolver
{
    public function __construct(bool $variable)
    {
        parent::__construct(
            'boolean',
            $variable,
            static function ($value) {
                return (bool) $value;
            },
            static function ($value) {
                return $value ? __('Yes', 'post-expirator') : __('No', 'post-expirator');
            }
        );
    }
}
