<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableStringResolvers;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\VariableStringResolverInterface;

class WorkflowResolver implements VariableStringResolverInterface
{
    /**
     * @var array
     */
    private $workflow;

    public function __construct(array $workflow)
    {
        $this->workflow = $workflow;
    }

    public function getType(): string
    {
        return 'workflow';
    }

    public function getValueAsString($property = ''): string
    {
        switch($property) {
            case 'id':
                return (string)$this->workflow['id'];

            case 'title':
                return (string)$this->workflow['title'];

            case 'description':
                return (string)$this->workflow['description'];

            case 'modified_at':
                return (string)$this->workflow['modified_at'];
        }

        return '';
    }
}
