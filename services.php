<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\ExecutableInterface;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\ModulesManager;
use PublishPressFuture\Core\ServicesAbstract;
use PublishPressFuture\Core\WordPress\ActionsFacade;
use PublishPressFuture\Core\WordPress\FiltersFacade;
use PublishPressFuture\Module\InstanceProtection\Controller as InstanceProtectionController;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.8.0-alpha.1',

    ServicesAbstract::PLUGIN_SLUG => 'post-expirator',

    ServicesAbstract::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),

    ServicesAbstract::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),

    ServicesAbstract::DEFAULT_FOOTER_CONTENT => __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'),

    ServicesAbstract::DEFAULT_FOOTER_STYLE => 'font-style: italic;',

    ServicesAbstract::DEFAULT_FOOTER_DISPLAY => '0',

    ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION => '0',

    ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',

    ServicesAbstract::DEFAULT_DEBUG => '0',

    ServicesAbstract::DEFAULT_EXPIRATION_DATE => 'null',

    ServicesAbstract::BASE_PATH => __DIR__,

    ServicesAbstract::LEGACY_PATH => __DIR__ . '/legacy',

    ServicesAbstract::BASE_URL => plugins_url('/', __FILE__),

    /**
     * @param ContainerInterface $container
     *
     * @return Plugin
     */
    ServicesAbstract::MODULES_MANAGER => static function(ContainerInterface $container)
    {
        $filtersFacade = $container->get(ServicesAbstract::FILTERS_FACADE);
        $modulesInstanceList = $container->get(ServicesAbstract::MODULES_LIST);
        $legacyPlugin = $container->get(ServicesAbstract::LEGACY_PLUGIN);

        return new ModulesManager($filtersFacade, $modulesInstanceList, $legacyPlugin);
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
    ServicesAbstract::FILTERS_FACADE => static function (ContainerInterface $container)
    {
        return new FiltersFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return ExecutableInterface
     */
    ServicesAbstract::ACTIONS_FACADE => static function (ContainerInterface $container)
    {
        return new ActionsFacade();
    },

    /**
     * @param ContainerInterface $container
     *
     * @return array
     */
    ServicesAbstract::MODULES_LIST => static function (ContainerInterface $container)
    {
        $filtersFacade = $container->get(ServicesAbstract::FILTERS_FACADE);

        $modulesList = [
            $container->get(ServicesAbstract::MODULE_INSTANCE_PROTECTION),
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
    ServicesAbstract::MODULE_INSTANCE_PROTECTION => static function (ContainerInterface $container)
    {
        $actionsFacade = $container->get(ServicesAbstract::ACTIONS_FACADE);
        $paths = $container->get(ServicesAbstract::PATHS);

        return new InstanceProtectionController($actionsFacade, $paths);
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
];
