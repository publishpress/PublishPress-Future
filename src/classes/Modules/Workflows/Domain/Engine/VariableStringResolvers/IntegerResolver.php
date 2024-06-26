<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class IntegerResolver implements VariableStringResolverInterface
{
    /**
     * @var int
     */
    private $variable;

    public function __construct(int $variable)
    {
        $this->variable = $variable;
    }

    public function getType(): string
    {
        return 'integer';
    }

    public function getValueAsString($property = ''): string
    {
        return intval($this->variable);
    }
}
