<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface RestApiManagerInterface
{
    public function register();

    public function getWorkflow($request);

    public function getWorkflowPermissions($request);
}
