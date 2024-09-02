<?php

namespace PublishPress\FuturePro;

use PublishPress\WordPressEDDLicense\Container as EDDContainer;
use PublishPress\WordPressEDDLicense\Services as EDDServices;
use PublishPress\WordPressEDDLicense\ServicesConfig as EDDServicesConfig;
use PublishPress\Future\Core\DI\ContainerInterface;
use PublishPress\Future\Core\DI\ServicesAbstract as FreeServicesAbstract;
use PublishPress\FuturePro\Controllers\BaseDateController;
use PublishPress\FuturePro\Controllers\BlocksController;
use PublishPress\FuturePro\Controllers\CustomStatusesController;
use PublishPress\FuturePro\Controllers\EddIntegrationController;
use PublishPress\FuturePro\Controllers\MetadataMappingController;
use PublishPress\FuturePro\Controllers\SettingsController;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Core\PluginInitializator;
use PublishPress\FuturePro\Core\ServicesAbstract;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;
use PublishPress\FuturePro\Modules\Workflows\DBTableSchemas\WorkflowScheduledStepsSchema;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\InputValidators\PostQuery;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\CronAction;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\CronStep;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\GeneralStep;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerProcessors\PostStep;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostDeactivateWorkflow;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostChangeStatus;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostTermsAdd;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostDelete;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostTermsRemove;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostTermsSet;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostStick;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CorePostUnstick;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CoreSendEmail;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced\CorePostQuery;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced\RayDebug;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced\CoreSchedule;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced\IfElse;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnCronSchedule;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnPostUpdated;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\FutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\WorkflowEngine;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\WorkflowVariablesHandler;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract as WorkflowsHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Migrations\V40000WorkflowScheduledStepsSchema;
use PublishPress\FuturePro\Modules\Workflows\Models\CronSchedulesModel;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;
use PublishPress\FuturePro\Modules\Workflows\Module;
use PublishPress\FuturePro\Modules\Workflows\Rest\RestApiManager;

defined('ABSPATH') or die('No direct script access allowed.');

return [
    ServicesAbstract::PLUGIN_VERSION => PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION,

    ServicesAbstract::PLUGIN_SLUG => PUBLISHPRESS_FUTURE_PRO_PLUGIN_SLUG,

    ServicesAbstract::PLUGIN_NAME => PUBLISHPRESS_FUTURE_PRO_PLUGIN_NAME,

    ServicesAbstract::PLUGIN_AUTHOR => PUBLISHPRESS_FUTURE_PRO_PLUGIN_AUTHOR,

    ServicesAbstract::PLUGIN_FILE => 'publishpress-future-pro/publishpress-future-pro.php',

    ServicesAbstract::BASE_PATH => PUBLISHPRESS_FUTURE_PRO_BASE_PATH,

    ServicesAbstract::TEMPLATE_PATH => PUBLISHPRESS_FUTURE_PRO_BASE_PATH . '/src/templates',

    ServicesAbstract::EDD_SITE_URL => PUBLISHPRESS_FUTURE_PRO_EDD_SITE_URL,

    ServicesAbstract::EDD_ITEM_ID => PUBLISHPRESS_FUTURE_PRO_EDD_ITEM_ID,


    /**
     * @return string
     */
    ServicesAbstract::BASE_URL => static function (ContainerInterface $container) {
        return plugins_url('/', $container->get(ServicesAbstract::PLUGIN_FILE));
    },

    /**
     * @return string
     */
    ServicesAbstract::ASSETS_URL => static function (ContainerInterface $container) {
        return $container->get(ServicesAbstract::BASE_URL) . '/src/assets';
    },

    ServicesAbstract::MODULES => static function (ContainerInterface $container) {
        $modulesServicesList = [
            ServicesAbstract::MODULE_WORKFLOWS,
            ServicesAbstract::MODULE_WPFORMS,
        ];

        $modules = [];
        foreach ($modulesServicesList as $service) {
            $modules[] = $container->get($service);
        }

        return $container->get(ServicesAbstract::HOOKS)->applyFilters(
            HooksAbstract::FILTER_MODULES_LIST,
            $modules
        );
    },

    /**
     * @return InitializableInterface[]
     */
    ServicesAbstract::CONTROLLERS => static function (ContainerInterface $container) {
        $controllerServicesList = [
            ServicesAbstract::CONTROLLER_CUSTOM_STATUSES,
            ServicesAbstract::CONTROLLER_SETTINGS,
            ServicesAbstract::CONTROLLER_EDD_INTEGRATION,
            ServicesAbstract::CONTROLLER_BASE_DATE,
            ServicesAbstract::CONTROLLER_BLOCKS,
            ServicesAbstract::CONTROLLER_METADATA_MAPPING,
        ];

        $controllers = [];
        foreach ($controllerServicesList as $service) {
            $controllers[] = $container->get($service);
        }

        return $container->get(ServicesAbstract::HOOKS)->applyFilters(
            HooksAbstract::FILTER_CONTROLLERS_LIST,
            $controllers
        );
    },

    /**
     * @return PluginInitializator
     */
    // FIXME: Could we simplify this and the above service to use the Free plugin initializator?
    ServicesAbstract::PLUGIN => static function (ContainerInterface $container) {
        return new PluginInitializator(
            $container->get(ServicesAbstract::CONTROLLERS),
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::BASE_PATH),
            $container->get(ServicesAbstract::MODULES)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
            $container->get(FreeServicesAbstract::EXPIRATION_ACTIONS_MODEL)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_SETTINGS => static function (ContainerInterface $container) {
        return new SettingsController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES),
            $container->get(ServicesAbstract::TEMPLATE_PATH),
            $container->get(ServicesAbstract::ASSETS_URL),
            $container->get(ServicesAbstract::EDD_CONTAINER),
            $container->get(ServicesAbstract::EDD_ITEM_ID),
            $container->get(ServicesAbstract::PLUGIN_VERSION)
        );
    },

    ServicesAbstract::CONTROLLER_EDD_INTEGRATION => static function (ContainerInterface $container) {
        return new EddIntegrationController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(ServicesAbstract::TEMPLATE_PATH),
            $container->get(ServicesAbstract::EDD_CONTAINER)
        );
    },

    ServicesAbstract::CONTROLLER_BASE_DATE => static function (ContainerInterface $container) {
        return new BaseDateController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS)
        );
    },

    ServicesAbstract::CONTROLLER_BLOCKS => static function (ContainerInterface $container) {
        return new BlocksController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::ASSETS_URL),
            $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
        );
    },

    ServicesAbstract::CONTROLLER_METADATA_MAPPING => static function (ContainerInterface $container) {
        return new MetadataMappingController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
            $container->get(FreeServicesAbstract::EXPIRATION_SCHEDULER),
            $container->get(FreeServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY)
        );
    },

    ServicesAbstract::MODULE_WORKFLOWS => static function (ContainerInterface $container) {
        return new Module(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::WORKFLOWS_REST_API_MANAGER),
            $container->get(ServicesAbstract::NODE_TYPES_MODEL),
            $container->get(ServicesAbstract::CRON_SCHEDULES_MODEL),
            $container->get(ServicesAbstract::WORKFLOW_ENGINE),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA),
            $container->get(ServicesAbstract::MIGRATIONS_FACTORY),
            $container->get(ServicesAbstract::PLUGIN_VERSION),
            $container->get(FreeServicesAbstract::CRON)
        );
    },

    ServicesAbstract::MODULE_WPFORMS => static function (ContainerInterface $container) {
        return new \PublishPress\FuturePro\Modules\Wpforms\Module(
            $container->get(ServicesAbstract::HOOKS)
        );
    },

    /**
     * @return \PublishPress\FuturePro\Models\CustomStatusesModel
     */
    ServicesAbstract::MODEL_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesModel();
    },

    ServicesAbstract::MODEL_SETTINGS => static function (ContainerInterface $container) {
        return new SettingsModel(
            $container->get(ServicesAbstract::OPTIONS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES)
        );
    },

    ServicesAbstract::LICENSE_KEY => static function (ContainerInterface $container) {
        return $container->get(ServicesAbstract::MODEL_SETTINGS)->getLicenseKey();
    },

    ServicesAbstract::LICENSE_STATUS => static function (ContainerInterface $container) {
        return $container->get(ServicesAbstract::MODEL_SETTINGS)->getLicenseStatus();
    },

    ServicesAbstract::EDD_CONTAINER => static function (ContainerInterface $container) {
        $config = new EDDServicesConfig();
        $config->setApiUrl($container->get(ServicesAbstract::EDD_SITE_URL))
            ->setLicenseKey($container->get(ServicesAbstract::LICENSE_KEY))
            ->setLicenseStatus($container->get(ServicesAbstract::LICENSE_STATUS))
            ->setPluginVersion($container->get(ServicesAbstract::PLUGIN_VERSION))
            ->setEddItemId($container->get(ServicesAbstract::EDD_ITEM_ID))
            ->setPluginAuthor($container->get(ServicesAbstract::PLUGIN_AUTHOR))
            ->setPluginFile($container->get(ServicesAbstract::PLUGIN_FILE));

        $services = new EDDServices($config);

        $eddContainer = new EDDContainer();
        $eddContainer->register($services);

        return $eddContainer;
    },

    ServicesAbstract::WORKFLOWS_REST_API_MANAGER => static function (ContainerInterface $container) {
        return new RestApiManager();
    },

    ServicesAbstract::NODE_TYPES_MODEL => static function (ContainerInterface $container) {
        return new NodeTypesModel(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS)
        );
    },

    ServicesAbstract::CRON_SCHEDULES_MODEL => static function (ContainerInterface $container) {
        return new CronSchedulesModel();
    },

    ServicesAbstract::WORKFLOW_VARIABLES_HANDLER => static function (ContainerInterface $container) {
        return new WorkflowVariablesHandler();
    },

    ServicesAbstract::WORKFLOW_ENGINE => static function (ContainerInterface $container) {
        return new WorkflowEngine(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(FreeServicesAbstract::CRON),
            $container->get(ServicesAbstract::NODE_TYPES_MODEL),
            $container->get(ServicesAbstract::NODE_RUNNER_FACTORY),
            $container->get(ServicesAbstract::WORKFLOW_VARIABLES_HANDLER)
        );
    },

    ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR =>
    static function (ContainerInterface $container): NodeRunnerProcessorInterface {
        return new GeneralStep(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::WORKFLOW_VARIABLES_HANDLER)
        );
    },

    ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR =>
    static function (ContainerInterface $container): NodeRunnerProcessorInterface {
        return new PostStep(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
        );
    },

    ServicesAbstract::CRON_STEP_NODE_RUNNER_PROCESSOR =>
    static function (ContainerInterface $container): AsyncNodeRunnerProcessorInterface {
        return new CronStep(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR),
            $container->get(FreeServicesAbstract::CRON),
            $container->get(ServicesAbstract::CRON_SCHEDULES_MODEL),
            $container->get(ServicesAbstract::NODE_TYPES_MODEL),
            $container->get(ServicesAbstract::WORKFLOW_VARIABLES_HANDLER),
            $container->get(ServicesAbstract::PLUGIN_VERSION),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(ServicesAbstract::WORKFLOW_ENGINE)
        );
    },

    ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA => static function (ContainerInterface $container) {
        $schemaHandler = $container->get(FreeServicesAbstract::DB_TABLE_SCHEMA_HANDLER_FACTORY);
        $schemaHandler = $schemaHandler();

        return new WorkflowScheduledStepsSchema(
            $schemaHandler,
            $container->get(ServicesAbstract::HOOKS)
        );
    },

    ServicesAbstract::MIGRATIONS_FACTORY => static function (ContainerInterface $container) {
        return function () use ($container) {
            return [
                new V40000WorkflowScheduledStepsSchema(
                    $container->get(ServicesAbstract::HOOKS),
                    $container->get(ServicesAbstract::DB_TABLE_WORKFLOW_SCHEDULED_STEPS_SCHEMA)
                )
            ];
        };
    },

    ServicesAbstract::NODE_RUNNER_FACTORY => static function (ContainerInterface $container) {
        return function ($nodeName) use ($container) {
            $nodeRunner = null;

            $settingsModel = $container->get(ServicesAbstract::MODEL_SETTINGS);

            switch ($nodeName) {
                // Triggers
                case CoreOnInit::getNodeTypeName():
                    if ($settingsModel->getExperimentalFeaturesStatus()) {
                        $nodeRunner = new CoreOnInit(
                            $container->get(ServicesAbstract::HOOKS),
                            $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                        );
                    }
                    break;

                case CoreOnAdminInit::getNodeTypeName():
                    if ($settingsModel->getExperimentalFeaturesStatus()) {
                        $nodeRunner = new CoreOnAdminInit(
                            $container->get(ServicesAbstract::HOOKS),
                            $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                        );
                    }
                    break;

                case CoreOnSavePost::getNodeTypeName():
                    $nodeRunner = new CoreOnSavePost(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY)
                    );
                    break;

                case CoreOnPostUpdated::getNodeTypeName():
                    $nodeRunner = new CoreOnPostUpdated(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY)
                    );
                    break;

                case CoreOnManuallyEnabledForPost::getNodeTypeName():
                    $nodeRunner = new CoreOnManuallyEnabledForPost(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(ServicesAbstract::INPUT_VALIDATOR_POST_QUERY)
                    );
                    break;

                case FutureLegacyAction::getNodeTypeName():
                    $nodeRunner = new FutureLegacyAction(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;

                case CoreOnCronSchedule::getNodeTypeName():
                    $nodeRunner = new CoreOnCronSchedule(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::CRON_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::CRON),
                        $container->get(ServicesAbstract::CRON_SCHEDULES_MODEL),
                        $container->get(ServicesAbstract::NODE_TYPES_MODEL),
                        $container->get(ServicesAbstract::WORKFLOW_VARIABLES_HANDLER),
                        $container->get(ServicesAbstract::PLUGIN_VERSION)
                    );
                    break;

                    // Actions
                case CorePostDelete::getNodeTypeName():
                    $nodeRunner = new CorePostDelete(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
                    );
                    break;

                case CorePostStick::getNodeTypeName():
                    $nodeRunner = new CorePostStick(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
                    );
                    break;

                case CorePostUnstick::getNodeTypeName():
                    $nodeRunner = new CorePostUnstick(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
                    );
                    break;

                case CorePostTermsAdd::getNodeTypeName():
                    $nodeRunner = new CorePostTermsAdd(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                        $container->get(FreeServicesAbstract::ERROR)
                    );
                    break;

                case CorePostTermsSet::getNodeTypeName():
                    $nodeRunner = new CorePostTermsSet(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                        $container->get(FreeServicesAbstract::ERROR)
                    );
                    break;

                case CorePostTermsRemove::getNodeTypeName():
                    $nodeRunner = new CorePostTermsRemove(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
                        $container->get(FreeServicesAbstract::ERROR)
                    );
                    break;

                case CorePostChangeStatus::getNodeTypeName():
                    $nodeRunner = new CorePostChangeStatus(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY)
                    );
                    break;

                case CoreSendEmail::getNodeTypeName():
                    $nodeRunner = new CoreSendEmail(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR),
                        $container->get(FreeServicesAbstract::EMAIL),
                        $container->get(ServicesAbstract::WORKFLOW_ENGINE)
                    );
                    break;

                case CorePostDeactivateWorkflow::getNodeTypeName():
                    $nodeRunner = new CorePostDeactivateWorkflow(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::POST_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;

                    // Advanced
                case CoreSchedule::getNodeTypeName():
                    $nodeRunner = new CoreSchedule(
                        $container->get(ServicesAbstract::CRON_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;

                case IfElse::getNodeTypeName():
                    $nodeRunner = new IfElse(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;

                case CorePostQuery::getNodeTypeName():
                    $nodeRunner = new CorePostQuery(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;

                case RayDebug::getNodeTypeName():
                    $nodeRunner = new RayDebug(
                        $container->get(ServicesAbstract::HOOKS),
                        $container->get(ServicesAbstract::GENERAL_STEP_NODE_RUNNER_PROCESSOR)
                    );
                    break;
            }

            $hooks = $container->get(ServicesAbstract::HOOKS);

            return $hooks->applyFilters(
                WorkflowsHooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_TRIGGER,
                $nodeRunner,
                $nodeName
            );
        };
    },

    ServicesAbstract::INPUT_VALIDATOR_POST_QUERY => static function (ContainerInterface $container) {
        return new PostQuery();
    },
];
