<?php

use Psr\Container\ContainerInterface;
use PublishPressFuture\Core\DI\ServicesAbstract as Services;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\Paths;
use PublishPressFuture\Core\Plugin;
use PublishPressFuture\Framework\Logger\Logger;
use PublishPressFuture\Framework\Logger\LoggerInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Framework\WordPress\Facade\DatabaseFacade;
use PublishPressFuture\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Framework\WordPress\Facade\EmailFacade;
use PublishPressFuture\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Framework\WordPress\Facade\RequestFacade;
use PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade;
use PublishPressFuture\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Framework\WordPress\Facade\UsersFacade;
use PublishPressFuture\Framework\WordPress\Models\PostModel;
use PublishPressFuture\Framework\WordPress\Models\TermModel;
use PublishPressFuture\Framework\WordPress\Models\UserModel;
use PublishPressFuture\Modules\Debug\Module as ModuleDebug;
use PublishPressFuture\Modules\Expirator\ExpirationActionMapper;
use PublishPressFuture\Modules\Expirator\ExpirationScheduler;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Expirator\Models\CurrentUserModel;
use PublishPressFuture\Modules\Expirator\Models\DefaultDataModel;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\Module as ModuleExpirator;
use PublishPressFuture\Modules\InstanceProtection\Module as ModuleInstanceProtection;
use PublishPressFuture\Modules\Settings\Module as ModuleSettings;
use PublishPressFuture\Modules\Settings\SettingsFacade;
use PublishPressFuture\Modules\WooCommerce\Module as ModuleWooCommerce;

return [
    Services::PLUGIN_VERSION => '2.8.2',

    Services::PLUGIN_SLUG => 'post-expirator',

    Services::PLUGIN_NAME => 'PublishPress Future',

    Services::DEFAULT_DATA => [
        Services::DEFAULT_DATE_FORMAT => __('l F jS, Y', 'post-expirator'),
        Services::DEFAULT_TIME_FORMAT => __('g:ia', 'post-expirator'),
        Services::DEFAULT_FOOTER_CONTENT => __(
            'Post expires at EXPIRATIONTIME on EXPIRATIONDATE',
            'post-expirator'
        ),
        Services::DEFAULT_FOOTER_STYLE => 'font-style: italic;',
        Services::DEFAULT_FOOTER_DISPLAY => '0',
        Services::DEFAULT_EMAIL_NOTIFICATION => '0',
        Services::DEFAULT_EMAIL_NOTIFICATION_ADMINS => '0',
        Services::DEFAULT_DEBUG => '0',
        Services::DEFAULT_EXPIRATION_DATE => 'null',
    ],

    Services::BASE_PATH => __DIR__,

    /**
     * @return string
     */
    Services::BASE_URL => static function (ContainerInterface $container) {
        return plugins_url('/', __FILE__);
    },

    /**
     * @return ModuleInterface[]
     */
    Services::MODULES => static function (ContainerInterface $container) {
        $modulesServiceList = [
            Services::MODULE_DEBUG,
            Services::MODULE_INSTANCE_PROTECTION,
            Services::MODULE_EXPIRATOR,
            Services::MODULE_SETTINGS,
            Services::MODULE_WOOCOMMERCE,
        ];

        $modules = [];
        foreach ($modulesServiceList as $service) {
            $modules[] = $container->get($service);
        }

        return $container->get(Services::HOOKS)->applyFilters(
            HooksAbstract::FILTER_MODULES_LIST,
            $modules
        );
    },

    /**
     * @return Plugin
     */
    Services::PLUGIN => static function (ContainerInterface $container) {
        return new Plugin(
            $container->get(Services::MODULES),
            $container->get(Services::LEGACY_PLUGIN),
            $container->get(Services::HOOKS),
            $container->get(Services::PLUGIN_SLUG),
            $container->get(Services::BASE_PATH)
        );
    },

    /**
     * @return PostExpirator_Facade
     */
    Services::LEGACY_PLUGIN => static function (ContainerInterface $container) {
        return PostExpirator_Facade::getInstance();
    },

    /**
     * @return Paths
     */
    Services::PATHS => static function (ContainerInterface $container) {
        return new Paths(__DIR__);
    },

    /**
     * @return LoggerInterface
     */
    Services::LOGGER => static function (ContainerInterface $container) {
        return new Logger(
            $container->get(Services::DB),
            $container->get(Services::SITE),
            $container->get(Services::SETTINGS)
        );
    },

    /**
     * @return CronFacade
     */
    Services::CRON => static function (ContainerInterface $container) {
        return new CronFacade();
    },

    /**
     * @return HooksFacade
     */
    Services::HOOKS => static function (ContainerInterface $container) {
        return new HooksFacade();
    },

    /**
     * @return DatabaseFacade
     */
    Services::DB => static function (ContainerInterface $container) {
        return new DatabaseFacade();
    },

    /**
     * @return DateTimeFacade
     */
    Services::DATETIME => static function (ContainerInterface $container) {
        return new DateTimeFacade();
    },

    /**
     * @return ErrorFacade
     */
    Services::ERROR => static function (ContainerInterface $container) {
        return new ErrorFacade();
    },

    /**
     * @return OptionsFacade
     */
    Services::OPTIONS => static function (ContainerInterface $container) {
        return new OptionsFacade();
    },

    /**
     * @return SiteFacade
     */
    Services::SITE => static function (ContainerInterface $container) {
        return new SiteFacade();
    },

    /**
     * @return UsersFacade
     */
    Services::USERS => static function (ContainerInterface $container) {
        return new UsersFacade();
    },

    /**
     * @return EmailFacade
     */
    Services::EMAIL => static function (ContainerInterface $container) {
        return new EmailFacade();
    },

    /**
     * @return \PublishPressFuture\Framework\WordPress\Facade\RequestFacade
     */
    Services::REQUEST => static function (ContainerInterface $container) {
        return new RequestFacade();
    },

    /**
     * @return \PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade
     */
    Services::SANITIZATION => static function (ContainerInterface $container) {
        return new SanitizationFacade();
    },

    /**
     * @return PublishPressFuture\Modules\Debug\Debug|null
     */
    Services::DEBUG => static function (ContainerInterface $container) {
        return new PublishPressFuture\Modules\Debug\Debug(
            $container->get(Services::LOGGER),
            $container->get(Services::SETTINGS)
        );
    },

    /**
     * @return SettingsFacade
     */
    Services::SETTINGS => static function (ContainerInterface $container) {
        return new SettingsFacade(
            $container->get(Services::HOOKS),
            $container->get(Services::OPTIONS),
            $container->get(Services::DEFAULT_DATA)
        );
    },

    /**
     * @return SchedulerInterface
     */
    Services::EXPIRATION_SCHEDULER => static function (ContainerInterface $container) {
        return new ExpirationScheduler(
            $container->get(Services::HOOKS),
            $container->get(Services::CRON),
            $container->get(Services::ERROR),
            $container->get(Services::LOGGER),
            $container->get(Services::DATETIME),
            $container->get(Services::POST_MODEL_FACTORY)
        );
    },

    /**
     * @return ModuleInterface
     */
    Services::MODULE_DEBUG => static function (ContainerInterface $container) {
        return new ModuleDebug(
            $container->get(Services::HOOKS),
            $container->get(Services::LOGGER)
        );
    },

    /**
     * @return ModuleInterface
     */
    Services::MODULE_WOOCOMMERCE => static function (ContainerInterface $container) {
        return new ModuleWooCommerce(
            $container->get(Services::BASE_URL),
            $container->get(Services::PLUGIN_VERSION)
        );
    },

    /**
     * @return ModuleInterface
     */
    Services::MODULE_INSTANCE_PROTECTION => static function (ContainerInterface $container) {
        return new ModuleInstanceProtection(
            $container->get(Services::PATHS),
            $container->get(Services::PLUGIN_SLUG),
            $container->get(Services::PLUGIN_NAME)
        );
    },

    /**
     * @return ModuleInterface
     */
    Services::MODULE_EXPIRATOR => static function (ContainerInterface $container) {
        return new ModuleExpirator(
            $container->get(Services::HOOKS),
            $container->get(Services::SITE),
            $container->get(Services::CRON),
            $container->get(Services::EXPIRATION_SCHEDULER),
            $container->get(Services::EXPIRABLE_POST_MODEL_FACTORY),
            $container->get(Services::SANITIZATION),
            $container->get(Services::CURRENT_USER_MODEL_FACTORY),
            $container->get(Services::REQUEST)
        );
    },

    /**
     * @return ModuleInterface
     */
    Services::MODULE_SETTINGS => static function (ContainerInterface $container) {
        return new ModuleSettings(
            $container->get(Services::HOOKS),
            $container->get(Services::SETTINGS)
        );
    },

    Services::POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function ($postId) use ($container) {
            return new PostModel(
                $postId,
                $container->get(Services::TERM_MODEL_FACTORY)
            );
        };
    },

    Services::TERM_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function ($termId) use ($container) {
            return new TermModel($termId);
        };
    },

    Services::USER_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function ($user) use ($container) {
            return new UserModel($user);
        };
    },

    Services::CURRENT_USER_MODEL_FACTORY => static function (ContainerInterface $container) {
        return static function () use ($container) {
            return new CurrentUserModel();
        };
    },

    Services::DEFAULT_DATA_MODEL => static function (ContainerInterface $container) {
        return new DefaultDataModel(
            $container->get(Services::SETTINGS),
            $container->get(Services::OPTIONS)
        );
    },

    Services::EXPIRABLE_POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        /**
         * @return ExpirablePostModel
         * @throws
         */
        return static function ($postId) use ($container) {
            return new ExpirablePostModel(
                $postId,
                $container->get(Services::DEBUG),
                $container->get(Services::OPTIONS),
                $container->get(Services::HOOKS),
                $container->get(Services::USERS),
                $container->get(Services::EXPIRATION_ACTION_MAPPER),
                $container->get(Services::EXPIRATION_SCHEDULER),
                $container->get(Services::SETTINGS),
                $container->get(Services::EMAIL),
                $container->get(Services::TERM_MODEL_FACTORY),
                $container->get(Services::EXPIRATION_ACTION_FACTORY)
            );
        };
    },

    Services::EXPIRATION_ACTION_MAPPER => static function (ContainerInterface $container) {
        return new ExpirationActionMapper();
    },

    Services::EXPIRATION_ACTION_FACTORY => static function (ContainerInterface $container) {
        /**
         * @return \PublishPressFuture\Modules\Expirator\Interfaces\ActionableInterface|false
         * @throws
         */
        return static function ($actionClassName, $postModel) use ($container) {
            if (! class_exists($actionClassName)) {
                $debug = $container->get(Services::DEBUG);

                $debug->log('Expiration action class ' . $actionClassName . ' is undefined');

                return false;
            }

            return new $actionClassName($postModel, $container->get(Services::ERROR));
        };
    }
];
