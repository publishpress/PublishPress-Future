<?php

use PublishPressFuture\Core\DI\ContainerInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuturePro\Controllers\CustomStatusesController;
use PublishPressFuturePro\Controllers\WorkflowLogController;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Core\PluginInitializator;
use PublishPressFuturePro\Core\ServicesAbstract;
use PublishPressFuturePro\Models\CustomStatusesModel;
use PublishPressFuturePro\Models\WorkflowLogModel;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.9.0-beta.2',

    ServicesAbstract::PLUGIN_SLUG => \PublishPressFuturePro\PLUGIN_SLUG,

    ServicesAbstract::PLUGIN_NAME => \PublishPressFuturePro\PLUGIN_NAME,

    ServicesAbstract::BASE_PATH => \PublishPressFuturePro\BASE_PATH,

    /**
     * @return string
     */
    ServicesAbstract::BASE_URL => static function (ContainerInterface $container) {
        return plugins_url('/', __FILE__);
    },

    /**
     * @return ModuleInterface[]
     */
    ServicesAbstract::CONTROLLERS => static function (ContainerInterface $container) {
        $controllerServicesList = [
            ServicesAbstract::CONTROLLER_CUSTOM_STATUSES,
            ServicesAbstract::CONTROLLER_WORKFLOW_LOG,
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
            $container->get(ServicesAbstract::HOOKS)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_WORKFLOW_LOG => static function (ContainerInterface $container) {
        return new WorkflowLogController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_WORKFLOW_LOG),
            $container->get(ServicesAbstract::OPTIONS),
            $container->get(ServicesAbstract::BASE_PATH)
        );
    },

    /**
     * @return \PublishPressFuturePro\Models\CustomStatusesModel
     */
    ServicesAbstract::MODEL_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesModel();
    },

    /**
     * @return \PublishPressFuturePro\Models\WorkflowLogModel
     */
    ServicesAbstract::MODEL_WORKFLOW_LOG => static function (ContainerInterface $container) {
        return new WorkflowLogModel();
    },
];
