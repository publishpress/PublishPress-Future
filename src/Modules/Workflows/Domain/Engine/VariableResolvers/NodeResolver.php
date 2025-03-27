<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;
use WP_Post;

use function wp_json_encode;

class NodeResolver implements VariableResolverInterface
{
    /**
     * @var array|object
     */
    private $node;

    public function __construct($node)
    {
        if (is_object($node)) {
            $this->node = $node->getVariable();
        } else {
            $this->node = (array)$node;
        }
    }

    public function getType(): string
    {
        return 'node';
    }

    public function getValue(string $propertyName = '')
    {
        switch ($propertyName) {
            case 'ID':
                return (int)$this->node['ID'];

            case 'name':
                return (string)$this->node['name'];

            case 'label':
                return (string)$this->node['label'];

            case 'activation_timestamp':
                return (string)$this->node['activation_timestamp'];

            case 'slug':
                return (string)$this->node['slug'];

            case 'postId':
            case 'post_id':
                return (int)$this->node['postId'];
        }

        return '';
    }

    public function getValueAsString(string $property = ''): string
    {
        return (string)$this->getValue($property);
    }

    public function compact(): array
    {
        return [
            'type' => $this->getType(),
            'value' => $this->node
        ];
    }

    /**
     * @inheritDoc
     */
    public function getVariable()
    {
        return $this->node;
    }

    public function setValue(string $name, $value): void
    {
        if (isset($this->node[$name])) {
            $this->node[$name] = $value;
        }
    }

    public function __isset($name): bool
    {
        return in_array($name, ['ID', 'name', 'label', 'activation_timestamp', 'slug', 'postId', 'post_id']);
    }

    public function __get($name)
    {
        if (isset($this->node[$name])) {
            return $this->node[$name];
        }

        return null;
    }

    public function __set($name, $value): void
    {
        if ($name === 'postId' || $name === 'post_id') {
            $this->node['postId'] = (int)$value;
        }

        return;
    }

    public function __unset($name): void
    {
        return;
    }

    public function __toString(): string
    {
        return wp_json_encode($this->node);
    }
}
