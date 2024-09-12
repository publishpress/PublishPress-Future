<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;

class WorkflowEngine implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            FreeHooksAbstract::ACTION_WORKFLOW_ENGINE_START,
            [$this, 'onWorkflowEngineStart']
        );
    }

    public function onWorkflowEngineStart()
    {
        ray('onWorkflowEngineStart');
    }
}
