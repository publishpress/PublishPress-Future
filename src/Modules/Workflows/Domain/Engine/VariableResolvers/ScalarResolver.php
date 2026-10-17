<?php

/**
 * Shared implementation for scalar workflow variable resolvers.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class ScalarResolver implements VariableResolverInterface
{
    /**
     * @var string
     */
    private $type;

    /**
     * @var mixed
     */
    private $variable;

    /**
     * @var callable|null
     */
    private $cast;

    /**
     * @var callable|null
     */
    private $stringify;

    /**
     * @param string        $type
     * @param mixed         $value
     * @param callable|null $cast
     * @param callable|null $stringify
     */
    public function __construct(string $type, $value, $cast = null, $stringify = null)
    {
        $this->type = $type;
        $this->variable = $value;
        $this->cast = $cast;
        $this->stringify = $stringify;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getValue(string $propertyName = '')
    {
        if ($this->cast !== null) {
            return ($this->cast)($this->variable);
        }

        return $this->variable;
    }

    public function getValueAsString(string $property = ''): string
    {
        if ($this->stringify !== null) {
            return ($this->stringify)($this->getValue($property));
        }

        return (string) $this->getValue($property);
    }

    public function compact(): array
    {
        return [
            'type' => $this->getType(),
            'value' => $this->variable,
        ];
    }

    /**
     * @inheritDoc
     */
    public function getVariable()
    {
        return $this->variable;
    }

    public function setValue(string $name, $value): void
    {
        if ($this->cast !== null) {
            $this->variable = ($this->cast)($value);

            return;
        }

        $this->variable = $value;
    }

    public function __isset($name): bool
    {
        return false;
    }

    public function __get($name)
    {
        return null;
    }

    public function __set($name, $value): void
    {
        return;
    }

    public function __unset($name): void
    {
        return;
    }

    public function __toString(): string
    {
        if ($this->stringify !== null) {
            return ($this->stringify)($this->getValue());
        }

        return (string) $this->variable;
    }
}
