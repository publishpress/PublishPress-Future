<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextRegistryInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextProcessorRegistryInterface;

class ExecutionContextRegistry implements ExecutionContextRegistryInterface
{
    private $executionContexts = [];

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var ExecutionContextProcessorRegistryInterface
     */
    private $executionContextProcessorRegistry;

    public function __construct(
        HookableInterface $hooks,
        ExecutionContextProcessorRegistryInterface $executionContextProcessorRegistry
    ) {
        $this->hooks = $hooks;
        $this->executionContextProcessorRegistry = $executionContextProcessorRegistry;
    }

    public function getExecutionContext(string $workflowExecutionId): ExecutionContextInterface
    {
        if (!isset($this->executionContexts[$workflowExecutionId])) {
            $this->executionContexts[$workflowExecutionId] = new ExecutionContext(
                $this->hooks,
                $this->executionContextProcessorRegistry
            );
        }

        return $this->executionContexts[$workflowExecutionId];
    }

    public function removeExecutionContext(string $workflowExecutionId): void
    {
        unset($this->executionContexts[$workflowExecutionId]);
    }
}
