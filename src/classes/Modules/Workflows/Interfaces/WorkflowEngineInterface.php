<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;

interface WorkflowEngineInterface
{
    public function start();

    public function getVariablesHandler(): WorkflowVariablesHandlerInterface;
}
