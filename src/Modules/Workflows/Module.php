<?php

namespace PublishPress\Future\Modules\Workflows;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RestApiManagerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

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
     * @var SettingsFacade
     */
    private $settingsFacade;

    /**
     * @var DBTableSchemaInterface
     */
    private $workflowScheduledStepsSchema;

    /**
     * @var \Closure
     */
    private $migrationsFactory;

    /**
     * @var string
     */
    private $pluginVersion;

    /**
     * @var CronInterface
     */
    private $cron;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        HookableInterface $hooksFacade,
        RestApiManagerInterface $restApiManager,
        NodeTypesModelInterface $nodeTypesModel,
        CronSchedulesModelInterface $cronSchedulesModel,
        WorkflowEngineInterface $workflowEngine,
        SettingsFacade $settingsFacade,
        DBTableSchemaInterface $workflowScheduledStepsSchema,
        \Closure $migrationsFactory,
        string $pluginVersion,
        CronInterface $cron,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooksFacade;
        $this->restApiManager = $restApiManager;
        $this->nodeTypesModel = $nodeTypesModel;
        $this->cronSchedulesModel = $cronSchedulesModel;
        $this->workflowEngine = $workflowEngine;
        $this->settingsFacade = $settingsFacade;
        $this->workflowScheduledStepsSchema = $workflowScheduledStepsSchema;
        $this->migrationsFactory = $migrationsFactory;
        $this->pluginVersion = $pluginVersion;
        $this->cron = $cron;
        $this->logger = $logger;
        /*
         * We initialize the engine in the constructor because it requires
         * the init hook has not been fired yet. The initialize method runs in the init hook.
         * We don't initialize the engine if the module is loaded by the Pro version. The Pro version
         * will initialize the engine in its own Module class.
         */
        if (! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO') || ! constant('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')) {
            $this->initializeEngine();
        }
    }

    public function initialize()
    {
        $this->initializeControllers();
    }

    private function initializeControllers()
    {
        $controllers = [
            new Controllers\PostType($this->hooks),
            new Controllers\WorkflowsList(
                $this->hooks,
                $this->nodeTypesModel,
                $this->logger,
                $this->settingsFacade
            ),
            new Controllers\WorkflowEditor(
                $this->hooks,
                $this->nodeTypesModel,
                $this->cronSchedulesModel,
                $this->settingsFacade
            ),
            new Controllers\RestApi($this->hooks, $this->restApiManager),
            new Controllers\FutureLegacyAction($this->hooks, $this->logger),
            new Controllers\ManualPostTrigger($this->hooks, $this->logger),
            new Controllers\ScheduledActions(
                $this->hooks,
                $this->nodeTypesModel,
                $this->cron,
                $this->settingsFacade,
                $this->logger
            ),
            new Controllers\SampleWorkflows(),
            new Controllers\PostsList($this->hooks),
            new Controllers\Settings($this->hooks, $this->workflowScheduledStepsSchema),
        ];

        foreach ($controllers as $controller) {
            $controller->initialize();
        }
    }

    private function initializeEngine()
    {
        if ($this->logger->isDownloadLogRequested()) {
            return;
        }

        $this->workflowEngine->start();
    }
}
