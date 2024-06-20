<?php

namespace PublishPress\FuturePro\Modules\Workflows;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\ScheduledActionsModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class Module implements InitializableInterface
{
    public const POST_TYPE_WORKFLOW = "ppfuture_workflow";

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RestApiManagerInterface
     */
    private $restApiManager;

    private $nodeTypesModel;

    /**
     * @var CronSchedulesModelInterface
     */
    private $cronSchedulesModel;

    /**
     * @var WorkflowEngineInterface
     */
    private $workflowEngine;

    public function __construct(
        HookableInterface $hooksFacade,
        RestApiManagerInterface $restApiManager,
        NodeTypesModelInterface $nodeTypesModel,
        CronSchedulesModelInterface $cronSchedulesModel,
        WorkflowEngineInterface $workflowEngine
    ) {
        $this->hooks = $hooksFacade;
        $this->restApiManager = $restApiManager;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->workflowEngine = $workflowEngine;

        /*
         * We initialize the engine in the constructor because it requires
         * the init hook has not been fired yet. The initialize method runs in the init hook.
         */
        $this->initializeEngine();
    }

    public function initialize()
    {
        $this->initializeControllers();
    }

    private function initializeControllers()
    {
        $controllers = [
            new Controllers\PostType($this->hooks),
            new Controllers\WorkflowsList($this->hooks, $this->nodeTypesModel),
            new Controllers\WorkflowEditor($this->hooks, $this->nodeTypesModel, $this->cronSchedulesModel),
            new Controllers\RestApi($this->hooks, $this->restApiManager),
            new Controllers\FutureLegacyAction($this->hooks),
            new Controllers\ManualPostTrigger($this->hooks),
            new Controllers\ScheduledActions($this->hooks, $this->nodeTypesModel),
            new Controllers\SampleWorkflows(),
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
