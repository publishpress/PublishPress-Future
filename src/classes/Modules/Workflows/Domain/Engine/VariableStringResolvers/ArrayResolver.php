<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class ArrayResolver implements VariableStringResolverInterface
{
    /**
     * @var array
     */
    private $variable;

    public function __construct(array $variable)
    {
        $this->variable = $variable;
    }

    public function getType(): string
    {
        return 'array';
    }

    public function getValueAsString($property = ''): string
    {
        if (isset($this->variable[$property])) {
            return (string)$this->variable[$property];
        }

        return '';
    }
}
