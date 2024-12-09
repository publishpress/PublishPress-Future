<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class UserMetaResolver implements VariableResolverInterface
{
    private $userId;

    public function __construct(int $userId)
    {
        $this->userId = $userId;
    }

    public function getType(): string
    {
        return 'user_meta';
    }

    public function getValue(string $name = '')
    {
        return get_user_meta($this->userId, $name, true);
    }

    public function getValueAsString(string $name = ''): string
    {
        return (string)$this->getValue($name);
    }

    public function compact($name = ''): array
    {
        return $this->getValue($name);
    }

    public function getVariable($name = '')
    {
        return $this->getValue($name);
    }

    public function __isset($name): bool
    {
        return metadata_exists('user', $this->userId, $name);
    }

    public function __get($name)
    {
        return $this->getValue($name);
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
        return $this->getType();
    }
}
