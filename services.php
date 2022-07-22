<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Core\PluginFacade;
use PublishPressFuture\Core\WordPress\CronFacade;
use PublishPressFuture\Core\WordPress\DatabaseFacade;
use PublishPressFuture\Core\WordPress\HooksFacade;
use PublishPressFuture\Core\WordPress\OptionsFacade;
use PublishPressFuture\Core\WordPress\SiteFacade;
use PublishPressFuture\Module\InstanceProtection\Controller as InstanceProtectionController;
use PublishPressFuture\Module\Expiration\Controller as ExpirationController;
use PublishPressFuture\Module\Debug\Controller as DebugController;
use PublishPressFuture\Module\Debug\Logger;
use PublishPressFuture\Module\Settings\Controller as SettingsController;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.8.0-alpha.1',

    ServicesAbstract::PLUGIN_SLUG => 'post-expirator',

    ServicesAbstract::DEFAULT_DATA => [
        ServicesAbstract::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),
        ServicesAbstract::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),
        ServicesAbstract::DEFAULT_FOOTER_CONTENT => __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'),
        ServicesAbstract::DEFAULT_FOOTER_STYLE => 'font-style: italic;',
        ServicesAbstract::DEFAULT_FOOTER_DISPLAY => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',
        ServicesAbstract::DEFAULT_DEBUG => '0',
        ServicesAbstract::DEFAULT_EXPIRATION_DATE => 'null',
    ],

    ServicesAbstract::BASE_PATH => __DIR__,

    ServicesAbstract::LEGACY_PATH => __DIR__ . '/legacy',

    ServicesAbstract::BASE_URL => plugins_url('/', __FILE__),

    /**
     * @param ContainerInterface $container
     *
     * @return Plugin
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
     * @return Plugin
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
     * @return Plugin
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

        $modulesList = [
            $container->get(ServicesAbstract::MODULE_INSTANCE_PROTECTION),
            $container->get(ServicesAbstract::MODULE_EXPIRATION),
            $container->get(ServicesAbstract::MODULE_DEBUG),
            $container->get(ServicesAbstract::MODULE_SETTINGS),
        ];

        $modulesList = $hooks->applyFilters(
            HooksAbstract::FILTER_MODULES_LIST,
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
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $paths = $container->get(ServicesAbstract::PATHS);

        return new InstanceProtectionController($hooks, $paths);
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

        return new ExpirationController($hooks, $site, $cron);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ExpirationController
     */
    ServicesAbstract::MODULE_DEBUG => static function (ContainerInterface $container)
    {
        $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
        $looger = $container->get(ServicesAbstract::LOGGER);

        return new DebugController($hooks, $looger);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return InstanceProtectionController
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
        $hooksFacade = $container->get(ServicesAbstract::HOOKS_FACADE);
        $databaseFacade = $container->get(ServicesAbstract::DATABASE_FACADE);
        $siteFacade = $container->get(ServicesAbstract::SITE_FACADE);

        $logger = new Logger($hooksFacade, $databaseFacade, $siteFacade);
        $logger->initialize();

        return $logger;
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
        $options = $container->get(ServicesAbstract::OPTIONS_FACADE);
        $defaultData = $container->get(ServicesAbstract::DEFAULT_DATA);

        return new SettingsController($hooks, $options, $defaultData);
    },
];
