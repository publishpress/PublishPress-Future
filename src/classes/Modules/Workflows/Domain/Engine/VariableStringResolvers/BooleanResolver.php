<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class BooleanResolver implements VariableStringResolverInterface
{
    /**
     * @var bool
     */
    private $variable;

    public function __construct(bool $variable)
    {
        $this->variable = $variable;
    }

    public function getType(): string
    {
        return 'boolean';
    }

    public function getValueAsString($property = ''): string
    {
        return $this->variable ? __('Yes', 'publishpress-future-pro') : __('No', 'publishpress-future-pro');
    }
}
