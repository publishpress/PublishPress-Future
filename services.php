<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\AbstractHooks;
use PublishPressFuture\Core\DI\AbstractServices;
use PublishPressFuture\Core\Framework\Logger\Logger;
use PublishPressFuture\Core\Framework\Logger\LoggerInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DatabaseFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\Plugin;
use PublishPressFuture\Modules\Debug\Module as ModuleDebug;
use PublishPressFuture\Modules\Expirator\ExpirationRunner;
use PublishPressFuture\Modules\Expirator\ExpirationScheduler;
use PublishPressFuture\Modules\Expirator\Module as ModuleExpiration;
use PublishPressFuture\Modules\Expirator\RunnerInterface;
use PublishPressFuture\Modules\Expirator\SchedulerInterface;
use PublishPressFuture\Modules\InstanceProtection\Module as ModuleInstanceProtection;
use PublishPressFuture\Modules\Settings\Module as ModuleSettings;
use PublishPressFuture\Modules\Settings\SettingsFacade;

return [
    AbstractServices::PLUGIN_VERSION => '2.8.0-alpha.1',

    AbstractServices::PLUGIN_SLUG => 'post-expirator',

    AbstractServices::PLUGIN_NAME => 'PublishPress Future',

    AbstractServices::DEFAULT_DATA => [
        AbstractServices::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),
        AbstractServices::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),
        AbstractServices::DEFAULT_FOOTER_CONTENT => __(
            'Post expires at EXPIRATIONTIME on EXPIRATIONDATE',
            'post-expirator'
        ),
        AbstractServices::DEFAULT_FOOTER_STYLE => 'font-style: italic;',
        AbstractServices::DEFAULT_FOOTER_DISPLAY => '0',
        AbstractServices::DEFAULT_EMAIL_NOTIFICATION => '0',
        AbstractServices::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',
        AbstractServices::DEFAULT_DEBUG => '0',
        AbstractServices::DEFAULT_EXPIRATION_DATE => 'null',
    ],

    AbstractServices::BASE_PATH => __DIR__,

    /**
     * @return string
     */
    AbstractServices::BASE_URL => static function (ContainerInterface $container) {
        return plugins_url('/', __FILE__);
    },

    /**
     * @return array
     */
    AbstractServices::MODULES => static function (ContainerInterface $container) {
        $modulesServiceList = [
            AbstractServices::MODULE_DEBUG,
            AbstractServices::MODULE_INSTANCE_PROTECTION,
            AbstractServices::MODULE_EXPIRATOR,
            AbstractServices::MODULE_SETTINGS,
        ];

        $modules = [];
        foreach ($modulesServiceList as $service) {
            $modules[] = $container->get($service);
        }

        return $container->get(AbstractServices::HOOKS)->applyFilters(
            AbstractHooks::FILTER_MODULES_LIST,
            $modules
        );
    },

    /**
     * @return Plugin
     */
    AbstractServices::PLUGIN => static function (ContainerInterface $container) {
        return new Plugin(
            $container->get(AbstractServices::MODULES),
            $container->get(AbstractServices::LEGACY_PLUGIN),
            $container->get(AbstractServices::HOOKS),
            $container->get(AbstractServices::PLUGIN_SLUG),
            $container->get(AbstractServices::BASE_PATH)
        );
    },

    /**
     * @return PostExpirator_Facade
     */
    AbstractServices::LEGACY_PLUGIN => static function (ContainerInterface $container) {
        return PostExpirator_Facade::getInstance();
    },

    /**
     * @return Paths
     */
    AbstractServices::PATHS => static function (ContainerInterface $container) {
        return new Paths(__DIR__);
    },

    /**
     * @return LoggerInterface
     */
    AbstractServices::LOGGER => function (ContainerInterface $container) {
        return new Logger(
            $container->get(AbstractServices::DB),
            $container->get(AbstractServices::SITE),
            $container->get(AbstractServices::SETTINGS)
        );
    },

    /**
     * @return CronFacade
     */
    AbstractServices::CRON => function (ContainerInterface $container) {
        return new CronFacade();
    },

    /**
     * @return HooksFacade
     */
    AbstractServices::HOOKS => function (ContainerInterface $container) {
        return new HooksFacade();
    },

    /**
     * @return DatabaseFacade
     */
    AbstractServices::DB => function (ContainerInterface $container) {
        return new DatabaseFacade();
    },

    /**
     * @return DateTimeFacade
     */
    AbstractServices::DATETIME => function (ContainerInterface $container) {
        return new DateTimeFacade();
    },

    /**
     * @return ErrorFacade
     */
    AbstractServices::ERROR => function (ContainerInterface $container) {
        return new ErrorFacade();
    },

    /**
     * @return OptionsFacade
     */
    AbstractServices::OPTIONS => function (ContainerInterface $container) {
        return new OptionsFacade();
    },

    /**
     * @return SiteFacade
     */
    AbstractServices::SITE => function (ContainerInterface $container) {
        return new SiteFacade();
    },

    /**
     * @return PublishPressFuture\Modules\Debug\Debug|null
     */
    AbstractServices::DEBUG => function (ContainerInterface $container) {
        return new PublishPressFuture\Modules\Debug\Debug(
            $container->get(AbstractServices::LOGGER)
        );
    },

    /**
     * @return SettingsFacade
     */
    AbstractServices::SETTINGS => function (ContainerInterface $container) {
        $hooks = $container->get(AbstractServices::HOOKS);
        $options = $container->get(AbstractServices::OPTIONS);
        $defaultData = $container->get(AbstractServices::DEFAULT_DATA);

        return new SettingsFacade(
            $hooks,
            $options,
            $defaultData
        );
    },

    /**
     * @return SchedulerInterface
     */
    AbstractServices::EXPIRATION_SCHEDULER => function (ContainerInterface $container) {
        $hooks = $container->get(AbstractServices::HOOKS);
        $cron = $container->get(AbstractServices::CRON);
        $error = $container->get(AbstractServices::ERROR);
        $logger = $container->get(AbstractServices::LOGGER);
        $datetime = $container->get(AbstractServices::DATETIME);
        $postModelFactory = $container->get(AbstractServices::POST_MODEL_FACTORY);

        return new ExpirationScheduler(
            $hooks,
            $cron,
            $error,
            $logger,
            $datetime,
            $postModelFactory
        );
    },

    /**
     * @return RunnerInterface
     */
    AbstractServices::EXPIRATION_RUNNER => function (ContainerInterface $container) {
        $hooks = $container->get(AbstractServices::HOOKS);
        $scheduler = $container->get(AbstractServices::EXPIRATION_SCHEDULER);
        $debug = $container->get(AbstractServices::DEBUG);
        $options = $container->get(AbstractServices::OPTIONS);
        $postModelFactory = $container->get(AbstractServices::POST_MODEL_FACTORY);

        return new ExpirationRunner(
            $hooks,
            $scheduler,
            $debug,
            $options,
            $postModelFactory
        );
    },

    /**
     * @return ModuleDebug
     */
    AbstractServices::MODULE_DEBUG => function (ContainerInterface $container) {
        return new ModuleDebug(
            $container->get(AbstractServices::HOOKS),
            $container->get(AbstractServices::LOGGER)
        );
    },

    /**
     * @return ModuleInstanceProtection
     */
    AbstractServices::MODULE_INSTANCE_PROTECTION => function (ContainerInterface $container) {
        return new ModuleInstanceProtection(
            $container->get(AbstractServices::PATHS),
            $container->get(AbstractServices::PLUGIN_SLUG),
            $container->get(AbstractServices::PLUGIN_NAME)
        );
    },

    /**
     * @return ModuleExpiration
     */
    AbstractServices::MODULE_EXPIRATOR => function (ContainerInterface $container) {
        return new ModuleExpiration(
            $container->get(AbstractServices::HOOKS),
            $container->get(AbstractServices::SITE),
            $container->get(AbstractServices::CRON),
            $container->get(AbstractServices::ERROR),
            $container->get(AbstractServices::LOGGER),
            $container->get(AbstractServices::DATETIME)
        );
    },

    /**
     * @return ModuleSettings
     */
    AbstractServices::MODULE_SETTINGS => function (ContainerInterface $container) {
        return new ModuleSettings();
    },

    AbstractServices::POST_MODEL_FACTORY => function (ContainerInterface $container) {
        return new \PublishPressFuture\Core\Framework\WordPress\Facade\PostModelFactory(
            $container->get(AbstractServices::DEBUG)
        );
    },
];
