<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

use function wp_json_encode;

class WorkflowResolver implements VariableResolverInterface
{
    /**
     * @var array
     */
    private $workflow;

    public function __construct(array $workflow)
    {
        $this->workflow = $workflow;

        if (isset($workflow['id'])) {
            $this->workflow['ID'] = $workflow['id'];
            unset($this->workflow['id']);
        }
    }

    public function getType(): string
    {
        return 'workflow';
    }

    public function getValue(string $property = '')
    {
        switch ($property) {
            case 'id':
            case 'ID':
                return (int)$this->workflow['ID'];

            case 'title':
                return (string)$this->workflow['title'];

            case 'description':
                return (string)$this->workflow['description'];

            case 'modified_at':
                return (string)$this->workflow['modified_at'];

            case 'steps':
                return (array)$this->workflow['steps'];

            case 'meta':
                return new WorkflowMetaResolver($this->workflow['ID']);
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
            'value' => $this->getValue('id')
        ];
    }

    /**
     * @inheritDoc
     */
    public function getVariable()
    {
        return $this->workflow;
    }

    public function __isset($name): bool
    {
        return in_array(
            $name,
            [
                'id',
                'ID',
                'title',
                'description',
                'modified_at',
                'steps',
                'meta',
            ]
        );
    }

    public function __get($name)
    {
        if (isset($this->$name)) {
            return $this->getValue($name);
        }

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
        return wp_json_encode($this->workflow);
    }
}
