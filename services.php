<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\HookFacadeInterface;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\PluginFacade;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Core\WordPress\ActionsFacade;
use PublishPressFuture\Core\WordPress\FiltersFacade;
use PublishPressFuture\Module\InstanceProtection\Controller as InstanceProtectionController;

return [
    ServicesAbstract::SERVICE_PLUGIN_VERSION => '2.8.0-alpha.1',

    ServicesAbstract::SERVICE_PLUGIN_SLUG => 'post-expirator',

    ServicesAbstract::SERVICE_DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),

    ServicesAbstract::SERVICE_DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),

    ServicesAbstract::SERVICE_DEFAULT_FOOTER_CONTENT => __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'),

    ServicesAbstract::SERVICE_DEFAULT_FOOTER_STYLE => 'font-style: italic;',

    ServicesAbstract::SERVICE_DEFAULT_FOOTER_DISPLAY => '0',

    ServicesAbstract::SERVICE_DEFAULT_EMAIL_NOTIFICATION => '0',

    ServicesAbstract::SERVICE_DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',

    ServicesAbstract::SERVICE_DEFAULT_DEBUG => '0',

    ServicesAbstract::SERVICE_DEFAULT_EXPIRATION_DATE => 'null',

    ServicesAbstract::SERVICE_BASE_PATH => __DIR__,

    ServicesAbstract::SERVICE_BASE_URL => plugins_url('/', __FILE__),

    /**
     * @param ContainerInterface $container
     *
     * @return Plugin
     */
    ServicesAbstract::SERVICE_PLUGIN_FACADE => static function(ContainerInterface $container)
    {
        $filtersFacade = $container->get(ServicesAbstract::SERVICE_FILTERS_FACADE);
        $modulesInstanceList = $container->get(ServicesAbstract::SERVICE_MODULES_LIST);
        $legacyPlugin = $container->get(ServicesAbstract::SERVICE_LEGACY_PLUGIN);

        return new PluginFacade($filtersFacade, $modulesInstanceList, $legacyPlugin);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return Plugin
     */
    ServicesAbstract::SERVICE_LEGACY_PLUGIN => static function(ContainerInterface $container)
    {
        return PostExpirator_Facade::getInstance();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return HookFacadeInterface
     */
    ServicesAbstract::SERVICE_FILTERS_FACADE => static function (ContainerInterface $container)
    {
        return new FiltersFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return HookFacadeInterface
     */
    ServicesAbstract::SERVICE_ACTIONS_FACADE => static function (ContainerInterface $container)
    {
        return new ActionsFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return array
     */
    ServicesAbstract::SERVICE_MODULES_LIST => static function (ContainerInterface $container)
    {
        $filtersFacade = $container->get(ServicesAbstract::SERVICE_FILTERS_FACADE);

        $modulesList = [
            $container->get(ServicesAbstract::SERVICE_MODULE_INSTANCE_PROTECTION),
        ];

        $modulesList = $filtersFacade->execute(
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
    ServicesAbstract::SERVICE_MODULE_INSTANCE_PROTECTION => static function (ContainerInterface $container)
    {
        $actionsFacade = $container->get(ServicesAbstract::SERVICE_ACTIONS_FACADE);
        $paths = $container->get(ServicesAbstract::SERVICE_PATHS);

        return new InstanceProtectionController($actionsFacade, $paths);
    },

    /**
     * @param ContainerInterface $container
     *
     * @return InstanceProtectionController
     */
    ServicesAbstract::SERVICE_PATHS => static function (ContainerInterface $container)
    {
        return new Paths(__DIR__);
    },
];
