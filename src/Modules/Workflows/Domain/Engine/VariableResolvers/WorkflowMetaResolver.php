<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers;

use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class WorkflowMetaResolver implements VariableResolverInterface
{
    private $workflowId;

    public function __construct(int $workflowId)
    {
        $this->workflowId = $workflowId;
    }

    public function getType(): string
    {
        return 'workflow_meta';
    }

    public function getValue(string $name = '')
    {
        return get_post_meta($this->workflowId, $name, true);
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
        return metadata_exists('post', $this->workflowId, $name);
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
