<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract as FreeHooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class WorkflowEngine implements WorkflowEngineInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var WorkflowEngineInterface
     */
    private $freeEngine;

    /**
     * @var NodeRunnerFactory
     */
    private $nodeRunnerFactory;

    public function __construct(
        HookableInterface $hooks,
        WorkflowEngineInterface $freeEngine,
        Closure $nodeRunnerFactory
    ) {
        $this->hooks = $hooks;
        $this->freeEngine = $freeEngine;
        $this->nodeRunnerFactory = $nodeRunnerFactory;

        $this->hooks->addFilter(
            FreeHooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_NODE_RUNNER,
            [$this, 'mapNodeRunner'],
            10,
            2
        );
    }

    public function start()
    {
        $this->freeEngine->start();
    }

    public function getVariablesHandler(): RuntimeVariablesHandlerInterface
    {
        return $this->freeEngine->getVariablesHandler();
    }

    public function setCurrentAsyncActionId($actionId)
    {
        $this->freeEngine->setCurrentAsyncActionId($actionId);
    }

    public function getCurrentAsyncActionId(): int
    {
        return $this->freeEngine->getCurrentAsyncActionId();
    }

    public function mapNodeRunner($nodeRunner, $nodeName)
    {
        $factory = $this->nodeRunnerFactory;
        $nodeRunner = $factory($nodeName);

        return $nodeRunner;
    }
}
