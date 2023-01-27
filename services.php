<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuturePro\Core\Plugin;
use PublishPressFuturePro\Core\ServicesAbstract;
use PublishPressFuturePro\Models\CustomStatusesModel;
use PublishPressFuturePro\Modules\CustomStatusesModule;
use PublishPressFuturePro\Modules\FreePluginModule;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.9.0-beta.2',

    ServicesAbstract::PLUGIN_SLUG => 'publishpress-future-pro',

    ServicesAbstract::PLUGIN_NAME => 'PublishPress Future Pro',

    ServicesAbstract::BASE_PATH => __DIR__,

    /**
     * @return string
     */
    ServicesAbstract::BASE_URL => static function (ContainerInterface $container) {
        return plugins_url('/', __FILE__);
    },

    /**
     * @return ModuleInterface[]
     */
    ServicesAbstract::MODULES => static function (ContainerInterface $container) {
        $modulesServiceList = [
            ServicesAbstract::MODULE_FREE_PLUGIN,
            ServicesAbstract::MODULE_CUSTOM_STATUSES,
        ];

        $modules = [];
        foreach ($modulesServiceList as $service) {
            $modules[] = $container->get($service);
        }

        return $container->get(ServicesAbstract::HOOKS)->applyFilters(
            HooksAbstract::FILTER_MODULES_LIST,
            $modules
        );
    },

    /**
     * @return Plugin
     */
    ServicesAbstract::PLUGIN => static function (ContainerInterface $container) {
        return new Plugin(
            $container->get(ServicesAbstract::MODULES),
            $container->get(ServicesAbstract::HOOKS)
        );
    },

    /**
     * @return HooksFacade
     */
    ServicesAbstract::HOOKS => static function (ContainerInterface $container) {
        return new HooksFacade();
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesModule(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::MODEL_CUSTOM_STATUSES)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_FREE_PLUGIN => static function (ContainerInterface $container) {
        return new FreePluginModule(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::BASE_PATH)
        );
    },

    /**
     * @return \PublishPressFuturePro\Models\CustomStatusesModel
     */
    ServicesAbstract::MODEL_CUSTOM_STATUSES => static function (ContainerInterface $container) {
        return new CustomStatusesModel();
    },
];
