<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

use Closure;

interface WorkflowEngineInterface
{
    public function start();

    public function getVariablesHandler(): RuntimeVariablesHandlerInterface;

    public function setCurrentAsyncActionId($actionId);

    public function getCurrentAsyncActionId(): int;

    public function getCurrentRunningWorkflow(): WorkflowModelInterface;

    public function getCurrentExecutionTrace(): array;
}
