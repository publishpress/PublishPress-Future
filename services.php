<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Core\Framework\Logger\Logger;
use PublishPressFuture\Core\Framework\Logger\LoggerInterface;
use PublishPressFuture\Core\Framework\ModuleInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DatabaseFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\PostModel;
use PublishPressFuture\Core\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\Plugin;
use PublishPressFuture\Modules\Debug\Module as ModuleDebug;
use PublishPressFuture\Modules\Expirator\ExpirationRunner;
use PublishPressFuture\Modules\Expirator\ExpirationScheduler;
use PublishPressFuture\Modules\Expirator\Interfaces\RunnerInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\Module as ModuleExpirator;
use PublishPressFuture\Modules\InstanceProtection\Module as ModuleInstanceProtection;
use PublishPressFuture\Modules\Settings\Module as ModuleSettings;
use PublishPressFuture\Modules\Settings\SettingsFacade;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.8.0-alpha.1',

    ServicesAbstract::PLUGIN_SLUG => 'post-expirator',

    ServicesAbstract::PLUGIN_NAME => 'PublishPress Future',

    ServicesAbstract::DEFAULT_DATA => [
        ServicesAbstract::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),
        ServicesAbstract::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),
        ServicesAbstract::DEFAULT_FOOTER_CONTENT => __(
            'Post expires at EXPIRATIONTIME on EXPIRATIONDATE',
            'post-expirator'
        ),
        ServicesAbstract::DEFAULT_FOOTER_STYLE => 'font-style: italic;',
        ServicesAbstract::DEFAULT_FOOTER_DISPLAY => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION => '0',
        ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',
        ServicesAbstract::DEFAULT_DEBUG => '0',
        ServicesAbstract::DEFAULT_EXPIRATION_DATE => 'null',
    ],

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
            ServicesAbstract::MODULE_DEBUG,
            ServicesAbstract::MODULE_INSTANCE_PROTECTION,
            ServicesAbstract::MODULE_EXPIRATOR,
            ServicesAbstract::MODULE_SETTINGS,
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
            $container->get(ServicesAbstract::LEGACY_PLUGIN),
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::PLUGIN_SLUG),
            $container->get(ServicesAbstract::BASE_PATH)
        );
    },

    /**
     * @return PostExpirator_Facade
     */
    ServicesAbstract::LEGACY_PLUGIN => static function (ContainerInterface $container) {
        return PostExpirator_Facade::getInstance();
    },

    /**
     * @return Paths
     */
    ServicesAbstract::PATHS => static function (ContainerInterface $container) {
        return new Paths(__DIR__);
    },

    /**
     * @return LoggerInterface
     */
    ServicesAbstract::LOGGER => static function (ContainerInterface $container) {
        return new Logger(
            $container->get(ServicesAbstract::DB),
            $container->get(ServicesAbstract::SITE),
            $container->get(ServicesAbstract::SETTINGS)
        );
    },

    /**
     * @return CronFacade
     */
    ServicesAbstract::CRON => static function (ContainerInterface $container) {
        return new CronFacade();
    },

    /**
     * @return HooksFacade
     */
    ServicesAbstract::HOOKS => static function (ContainerInterface $container) {
        return new HooksFacade();
    },

    /**
     * @return DatabaseFacade
     */
    ServicesAbstract::DB => static function (ContainerInterface $container) {
        return new DatabaseFacade();
    },

    /**
     * @return DateTimeFacade
     */
    ServicesAbstract::DATETIME => static function (ContainerInterface $container) {
        return new DateTimeFacade();
    },

    /**
     * @return ErrorFacade
     */
    ServicesAbstract::ERROR => static function (ContainerInterface $container) {
        return new ErrorFacade();
    },

    /**
     * @return OptionsFacade
     */
    ServicesAbstract::OPTIONS => static function (ContainerInterface $container) {
        return new OptionsFacade();
    },

    /**
     * @return SiteFacade
     */
    ServicesAbstract::SITE => static function (ContainerInterface $container) {
        return new SiteFacade();
    },

    /**
     * @return PublishPressFuture\Modules\Debug\Debug|null
     */
    ServicesAbstract::DEBUG => static function (ContainerInterface $container) {
        return new PublishPressFuture\Modules\Debug\Debug(
            $container->get(ServicesAbstract::LOGGER)
        );
    },

    /**
     * @return SettingsFacade
     */
    ServicesAbstract::SETTINGS => static function (ContainerInterface $container) {
        $hooks = $container->get(ServicesAbstract::HOOKS);
        $options = $container->get(ServicesAbstract::OPTIONS);
        $defaultData = $container->get(ServicesAbstract::DEFAULT_DATA);

        return new SettingsFacade(
            $hooks,
            $options,
            $defaultData
        );
    },

    /**
     * @return SchedulerInterface
     */
    ServicesAbstract::EXPIRATION_SCHEDULER => static function (ContainerInterface $container) {
        $hooks = $container->get(ServicesAbstract::HOOKS);
        $cron = $container->get(ServicesAbstract::CRON);
        $error = $container->get(ServicesAbstract::ERROR);
        $logger = $container->get(ServicesAbstract::LOGGER);
        $datetime = $container->get(ServicesAbstract::DATETIME);
        $postModelFactory = $container->get(ServicesAbstract::POST_MODEL_FACTORY);

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
    ServicesAbstract::EXPIRATION_RUNNER => static function (ContainerInterface $container) {
        $hooks = $container->get(ServicesAbstract::HOOKS);
        $scheduler = $container->get(ServicesAbstract::EXPIRATION_SCHEDULER);
        $debug = $container->get(ServicesAbstract::DEBUG);
        $options = $container->get(ServicesAbstract::OPTIONS);
        $expirablePostModelFactory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);

        return new ExpirationRunner(
            $hooks,
            $scheduler,
            $debug,
            $options,
            $expirablePostModelFactory
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_DEBUG => static function (ContainerInterface $container) {
        return new ModuleDebug(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::LOGGER)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_INSTANCE_PROTECTION => static function (ContainerInterface $container) {
        return new ModuleInstanceProtection(
            $container->get(ServicesAbstract::PATHS),
            $container->get(ServicesAbstract::PLUGIN_SLUG),
            $container->get(ServicesAbstract::PLUGIN_NAME)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_EXPIRATOR => static function (ContainerInterface $container) {
        return new ModuleExpirator(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::SITE),
            $container->get(ServicesAbstract::CRON),
            $container->get(ServicesAbstract::ERROR),
            $container->get(ServicesAbstract::LOGGER),
            $container->get(ServicesAbstract::DATETIME),
            $container->get(ServicesAbstract::EXPIRATION_RUNNER),
            $container->get(ServicesAbstract::EXPIRATION_SCHEDULER)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_SETTINGS => static function (ContainerInterface $container) {
        return new ModuleSettings(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::SETTINGS)
        );
    },

    ServicesAbstract::POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function ($postId) use ($container) {
            return new PostModel(
                $postId,
                $container->get(ServicesAbstract::DEBUG)
            );
        };
    },

    ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function ($postId) use ($container) {
            $postModelFactory = $container->get(ServicesAbstract::POST_MODEL_FACTORY);

            $postModel = $postModelFactory($postId);

            return new ExpirablePostModel($postModel);
        };
    },
];
