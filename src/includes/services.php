<?php

namespace PublishPressFuturePro;

use PublishPress\EDD_License\Core\Container as EDDContainer;
use PublishPress\EDD_License\Core\Services as EDDServices;
use PublishPress\EDD_License\Core\ServicesConfig as EDDServicesConfig;
use PublishPressFuture\Core\DI\ContainerInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuturePro\Controllers\CustomStatusesController;
use PublishPressFuturePro\Controllers\EddIntegrationController;
use PublishPressFuturePro\Controllers\SettingsController;
use PublishPressFuturePro\Controllers\WorkflowLogController;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Core\PluginInitializator;
use PublishPressFuturePro\Core\ServicesAbstract;
use PublishPressFuturePro\Models\CustomStatusesModel;
use PublishPressFuturePro\Models\SettingsModel;
use PublishPressFuturePro\Models\WorkflowLogModel;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.9.0-beta.4',

    ServicesAbstract::PLUGIN_SLUG => PLUGIN_SLUG,

    ServicesAbstract::PLUGIN_NAME => PLUGIN_NAME,

    ServicesAbstract::PLUGIN_AUTHOR => 'PublishPress',

    ServicesAbstract::PLUGIN_FILE => 'publishpress-future-pro/publishpress-future-pro.php',

    ServicesAbstract::BASE_PATH => BASE_PATH,

    ServicesAbstract::TEMPLATE_PATH => BASE_PATH . '/src/templates',

    ServicesAbstract::EDD_SITE_URL => 'https://publishpress.com',

    ServicesAbstract::EDD_ITEM_ID => '129032',


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

    /**
     * @return ModuleInterface[]
     */
    ServicesAbstract::CONTROLLERS => static function (ContainerInterface $container) {
        $controllerServicesList = [
            ServicesAbstract::CONTROLLER_CUSTOM_STATUSES,
            ServicesAbstract::CONTROLLER_WORKFLOW_LOG,
            ServicesAbstract::CONTROLLER_SETTINGS,
            ServicesAbstract::CONTROLLER_EDD_INTEGRATION,
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
            $container->get(ServicesAbstract::MODEL_SETTINGS),
            $container->get(ServicesAbstract::TEMPLATE_PATH)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_SETTINGS => static function (ContainerInterface $container) {
        return new SettingsController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_SETTINGS),
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

    ServicesAbstract::MODEL_SETTINGS => static function (ContainerInterface $container) {
        return new SettingsModel(
            $container->get(ServicesAbstract::OPTIONS)
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
];
