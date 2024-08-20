<?php

namespace PublishPress\FuturePro\Modules\Workflows;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Models\SettingsModel;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;
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

    /**
     * @var SettingsModel
     */
    private $settingsModel;

    public function __construct(
        HookableInterface $hooksFacade,
        RestApiManagerInterface $restApiManager,
        NodeTypesModelInterface $nodeTypesModel,
        CronSchedulesModelInterface $cronSchedulesModel,
        WorkflowEngineInterface $workflowEngine,
        SettingsModel $settingsModel
    ) {
        $this->hooks = $hooksFacade;
        $this->restApiManager = $restApiManager;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->workflowEngine = $workflowEngine;
        $this->settingsModel = $settingsModel;

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
            new Controllers\WorkflowEditor(
                $this->hooks,
                $this->nodeTypesModel,
                $this->cronSchedulesModel,
                $this->settingsModel
            ),
            new Controllers\RestApi($this->hooks, $this->restApiManager),
            new Controllers\FutureLegacyAction($this->hooks),
            new Controllers\ManualPostTrigger($this->hooks),
            new Controllers\ScheduledActions($this->hooks, $this->nodeTypesModel),
            new Controllers\SampleWorkflows(),
            new Controllers\PostsList($this->hooks),
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
