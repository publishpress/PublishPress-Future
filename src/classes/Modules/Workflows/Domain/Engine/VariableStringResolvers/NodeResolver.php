<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;
use WP_Post;

class NodeResolver implements VariableStringResolverInterface
{
    /**
     * @var array
     */
    private $node;

    public function __construct(array $node)
    {
        $this->node = $node;
    }

    public function getType(): string
    {
        return 'node';
    }

    public function getValueAsString($property = ''): string
    {
        switch($property) {
            case 'ID':
            case 'id':
                return (string)$this->node['ID'];

            case 'name':
                return (string)$this->node['name'];

            case 'label':
                return (string)$this->node['label'];

            case 'activation_timestamp':
                return (string)$this->node['activation_timestamp'];
        }

        return '';
    }
}
