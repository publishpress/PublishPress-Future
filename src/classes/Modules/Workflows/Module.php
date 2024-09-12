<?php

namespace PublishPress\FuturePro\Modules\Workflows;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class Module implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var WorkflowEngineInterface
     */
    private $workflowEngine;

    public function __construct(
        HookableInterface $hooksFacade,
        WorkflowEngineInterface $workflowEngine
    ) {
        $this->hooks = $hooksFacade;
        $this->workflowEngine = $workflowEngine;

        $this->initializeEngine();
    }

    public function initialize()
    {
        $this->initializeControllers();
    }

    private function initializeControllers()
    {
        $controllers = [
            new Controllers\WorkflowEngine($this->hooks),
            new Controllers\WorkflowEditor($this->hooks),
        ];

        foreach ($controllers as $controller) {
            $controller->initialize();
        }
    }

    private function initializeEngine()
    {
        $this->workflowEngine->start();
    }
}
