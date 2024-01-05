<?php

namespace PublishPress\FuturePro;

use PublishPress\WordPressEDDLicense\Container as EDDContainer;
use PublishPress\WordPressEDDLicense\Services as EDDServices;
use PublishPress\WordPressEDDLicense\ServicesConfig as EDDServicesConfig;
use PublishPress\Future\Core\DI\ContainerInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\FuturePro\Controllers\BaseDateController;
use PublishPress\FuturePro\Controllers\CustomStatusesController;
use PublishPress\FuturePro\Controllers\EddIntegrationController;
use PublishPress\FuturePro\Controllers\SettingsController;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Core\PluginInitializator;
use PublishPress\FuturePro\Core\ServicesAbstract;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;

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

    /**
     * @return ModuleInterface[]
     */
    ServicesAbstract::CONTROLLERS => static function (ContainerInterface $container) {
        $controllerServicesList = [
            ServicesAbstract::CONTROLLER_CUSTOM_STATUSES,
            ServicesAbstract::CONTROLLER_SETTINGS,
            ServicesAbstract::CONTROLLER_EDD_INTEGRATION,
            ServicesAbstract::CONTROLLER_BASE_DATE,
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
            $container->get(ServicesAbstract::BASE_PATH)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::CONTROLLER_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesController(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES),
            $container->get(ServicesAbstract::MODEL_SETTINGS)
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
];
