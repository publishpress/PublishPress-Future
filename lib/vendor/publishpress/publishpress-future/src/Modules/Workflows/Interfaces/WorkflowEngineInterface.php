<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface WorkflowEngineInterface
{
    public function start();

    public function getVariablesHandler(): RuntimeVariablesHandlerInterface;

    public function setCurrentAsyncActionId($actionId);

    public function getCurrentAsyncActionId(): int;
}
