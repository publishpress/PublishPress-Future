<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\Helpers\DateTimeHelper;
use PublishPressFuture\Core\Hooks\FiltersAbstract;
use PublishPressFuture\Core\InstanceProtection\Controller as InstanceProtectionController;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\PluginFacade;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Core\WordPress\CronFacade;
use PublishPressFuture\Core\WordPress\DatabaseFacade;
use PublishPressFuture\Core\WordPress\DateTimeFacade;
use PublishPressFuture\Core\WordPress\ErrorFacade;
use PublishPressFuture\Core\WordPress\HooksFacade;
use PublishPressFuture\Core\WordPress\OptionsFacade;
use PublishPressFuture\Core\WordPress\SiteFacade;
use PublishPressFuture\Modules\Debug\Controller as DebugController;
use PublishPressFuture\Modules\Debug\Logger;
use PublishPressFuture\Modules\PostExpirator\Controller as ExpirationController;
use PublishPressFuture\Modules\PostExpirator\Interfaces\ExecutableInterface;
use PublishPressFuture\Modules\PostExpirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\PostExpirator\Scheduler;
use PublishPressFuture\Modules\Settings\Controller as SettingsController;
use PublishPressFuture\Modules\Settings\SettingsFacade;

return array(
    ServicesAbstract::PLUGIN_VERSION => '2.8.0-alpha.1',

    ServicesAbstract::PLUGIN_SLUG => 'post-expirator',

    ServicesAbstract::DEFAULT_DATA => array(
        ServicesAbstract::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),
        ServicesAbstract::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),
        ServicesAbstract::DEFAULT_FOOTER_CONTENT => __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'),
        ServicesAbstract::DEFAULT_FOOTER_STYLE => 'font-style: italic;',
        ServicesAbstract::DEFAULT_FOOTER_DISPLAY => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',
        ServicesAbstract::DEFAULT_DEBUG => '0',
        ServicesAbstract::DEFAULT_EXPIRATION_DATE => 'null',
    ),

    ServicesAbstract::BASE_PATH => __DIR__,

    ServicesAbstract::LEGACY_PATH => __DIR__ . '/legacy',

    ServicesAbstract::BASE_URL => plugins_url('/', __FILE__),

    /**
     * @param ContainerInterface $container
     *
     * @return PluginFacade
     */
    ServicesAbstract::PLUGIN_FACADE => static function(ContainerInterface $container)
    {
        $modulesManager = $container->get(ServicesAbstract::MODULES_MANAGER);
        $legacyPlugin = $container->get(ServicesAbstract::LEGACY_PLUGIN);
        $hooksFacade = $container->get(ServicesAbstract::HOOKS_FACADE);
        $basePath = $container->get(ServicesAbstract::BASE_PATH);
        $pluginSlug = $container->get(ServicesAbstract::PLUGIN_SLUG);

        return new PluginFacade($modulesManager, $legacyPlugin, $hooksFacade, $pluginSlug, $basePath);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ModulesManager
     */
    ServicesAbstract::MODULES_MANAGER => static function(ContainerInterface $container)
    {
        $hooksFacade = $container->get(ServicesAbstract::HOOKS_FACADE);
        $modulesInstanceList = $container->get(ServicesAbstract::MODULES_LIST);

        return new ModulesManager($hooksFacade, $modulesInstanceList);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return PostExpirator_Facade
     */
    ServicesAbstract::LEGACY_PLUGIN => static function(ContainerInterface $container)
    {
        return PostExpirator_Facade::getInstance();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ExecutableInterface
     */
    ServicesAbstract::HOOKS_FACADE => static function (ContainerInterface $container)
    {
        return new HooksFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return array
     */
    ServicesAbstract::MODULES_LIST => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);

        $modulesList = array(
            $container->get(ServicesAbstract::MODULE_INSTANCE_PROTECTION),
            $container->get(ServicesAbstract::MODULE_EXPIRATION),
            $container->get(ServicesAbstract::MODULE_DEBUG),
            $container->get(ServicesAbstract::MODULE_SETTINGS),
        );

        $modulesList = $hooks->applyFilters(
            FiltersAbstract::MODULES_LIST,
            $modulesList
        );

        return $modulesList;
    },

    /**
     * @param ContainerInterface $container
     *
     * @return InstanceProtectionController
     */
    ServicesAbstract::MODULE_INSTANCE_PROTECTION => static function (ContainerInterface $container)
    {
        $paths = $container->get(ServicesAbstract::PATHS);

        return new InstanceProtectionController($paths);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ExpirationController
     */
    ServicesAbstract::MODULE_EXPIRATION => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $site = $container->get(ServicesAbstract::SITE_FACADE);
        $cron = $container->get(ServicesAbstract::CRON_FACADE);
        $scheduler = $container->get(ServicesAbstract::SCHEDULER_FACADE);

        return new ExpirationController($hooks, $site, $cron, $scheduler);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ExpirationController
     */
    ServicesAbstract::MODULE_DEBUG => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $logger = $container->get(ServicesAbstract::LOGGER);

        return new DebugController($hooks, $logger);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return Paths
     */
    ServicesAbstract::PATHS => static function (ContainerInterface $container)
    {
        return new Paths(__DIR__);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return InstanceProtectionController
     */
    ServicesAbstract::LOGGER => static function (ContainerInterface $container)
    {
        $databaseFacade = $container->get(ServicesAbstract::DATABASE_FACADE);
        $siteFacade = $container->get(ServicesAbstract::SITE_FACADE);
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS_FACADE);

        return new Logger($databaseFacade, $siteFacade, $settingsFacade);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return InstanceProtectionController
     */
    ServicesAbstract::DATABASE_FACADE => static function (ContainerInterface $container)
    {
        return new DatabaseFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return SiteFacade
     */
    ServicesAbstract::SITE_FACADE => static function (ContainerInterface $container)
    {
        return new SiteFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return OptionsFacade
     */
    ServicesAbstract::OPTIONS_FACADE => static function (ContainerInterface $container)
    {
        return new OptionsFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return CronFacade
     */
    ServicesAbstract::CRON_FACADE => static function (ContainerInterface $container)
    {
        return new CronFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return SettingsController
     */
    ServicesAbstract::MODULE_SETTINGS => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $settings = $container->get(ServicesAbstract::SETTINGS_FACADE);

        return new SettingsController($hooks, $settings);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return SettingsFacade
     */
    ServicesAbstract::SETTINGS_FACADE => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $options = $container->get(ServicesAbstract::OPTIONS_FACADE);
        $defaultData = $container->get(ServicesAbstract::DEFAULT_DATA);

        return new SettingsFacade($hooks, $options, $defaultData);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ErrorFacade
     */
    ServicesAbstract::ERROR_FACADE => static function (ContainerInterface $container)
    {
        return new ErrorFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return SchedulerInterface
     */
    ServicesAbstract::SCHEDULER_FACADE => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $cron = $container->get(ServicesAbstract::CRON_FACADE);
        $error = $container->get(ServicesAbstract::ERROR_FACADE);
        $logger = $container->get(ServicesAbstract::LOGGER);
        $dateTimeHelper = $container->get(ServicesAbstract::DATETIME_HELPER);

        return new Scheduler($hooks, $cron, $error, $logger, $dateTimeHelper);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return DateTimeFacade
     */
    ServicesAbstract::DATETIME_FACADE => static function (ContainerInterface $container)
    {
        return new DateTimeFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return DateTimeHelper
     */
    ServicesAbstract::DATETIME_HELPER => static function (ContainerInterface $container)
    {
        $dateTime = $container->get(ServicesAbstract::DATETIME_FACADE);

        return new DateTimeHelper($dateTime);
    },
);
