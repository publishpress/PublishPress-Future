<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class StringResolver implements VariableStringResolverInterface
{
    /**
     * @var string
     */
    private $variable;

    public function __construct(string $variable)
    {
        $this->variable = $variable;
    }

    public function getType(): string
    {
        return 'string';
    }

    public function getValueAsString($property = ''): string
    {
        return (string)$this->variable;
    }
}
