<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class PostMetaResolver implements VariableResolverInterface
{
    private $postId;

    public function __construct(int $postId)
    {
        $this->postId = $postId;
    }

    public function getType(): string
    {
        return 'post_meta';
    }

    public function getValue(string $name = '')
    {
        return get_post_meta($this->postId, $name, true);
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
        return metadata_exists('post', $this->postId, $name);
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
