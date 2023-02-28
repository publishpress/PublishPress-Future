<?php

use PublishPressFuture\Core\DI\ContainerInterface;
use PublishPressFuture\Core\DI\ServicesAbstract;
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
use PublishPressFuture\Modules\Expirator\ExpirationActions\DeletePost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryAdd;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategoryRemove;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostCategorySet;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToDraft;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToPrivate;
use PublishPressFuture\Modules\Expirator\ExpirationActions\PostStatusToTrash;
use PublishPressFuture\Modules\Expirator\ExpirationActions\StickPost;
use PublishPressFuture\Modules\Expirator\ExpirationActions\UnstickPost;
use PublishPressFuture\Modules\Expirator\ExpirationActionsAbstract;
use PublishPressFuture\Modules\Expirator\ExpirationScheduler;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpirationHooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Expirator\Models\CurrentUserModel;
use PublishPressFuture\Modules\Expirator\Models\DefaultDataModel;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel;
use PublishPressFuture\Modules\Expirator\Module as ModuleExpirator;
use PublishPressFuture\Modules\InstanceProtection\Module as ModuleInstanceProtection;
use PublishPressFuture\Modules\Settings\Models\SettingsPostTypesModel;
use PublishPressFuture\Modules\Settings\Models\TaxonomiesModel;
use PublishPressFuture\Modules\Settings\Module as ModuleSettings;
use PublishPressFuture\Modules\Settings\SettingsFacade;
use PublishPressFuture\Modules\VersionNotices\Module as ModuleVersionNotices;
use PublishPressFuture\Modules\WooCommerce\Module as ModuleWooCommerce;

return [
    ServicesAbstract::PLUGIN_VERSION => '2.9.2',

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
            ServicesAbstract::MODULE_VERSION_NOTICES,
            ServicesAbstract::MODULE_EXPIRATOR,
            ServicesAbstract::MODULE_SETTINGS,
            ServicesAbstract::MODULE_WOOCOMMERCE,
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
     * @return UsersFacade
     */
    ServicesAbstract::USERS => static function (ContainerInterface $container) {
        return new UsersFacade();
    },

    /**
     * @return EmailFacade
     */
    ServicesAbstract::EMAIL => static function (ContainerInterface $container) {
        return new EmailFacade();
    },

    /**
     * @return \PublishPressFuture\Framework\WordPress\Facade\RequestFacade
     */
    ServicesAbstract::REQUEST => static function (ContainerInterface $container) {
        return new RequestFacade();
    },

    /**
     * @return \PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade
     */
    ServicesAbstract::SANITIZATION => static function (ContainerInterface $container) {
        return new SanitizationFacade();
    },

    /**
     * @return PublishPressFuture\Modules\Debug\Debug|null
     */
    ServicesAbstract::DEBUG => static function (ContainerInterface $container) {
        return new PublishPressFuture\Modules\Debug\Debug(
            $container->get(ServicesAbstract::LOGGER),
            $container->get(ServicesAbstract::SETTINGS)
        );
    },

    /**
     * @return SettingsFacade
     */
    ServicesAbstract::SETTINGS => static function (ContainerInterface $container) {
        return new SettingsFacade(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::OPTIONS),
            $container->get(ServicesAbstract::DEFAULT_DATA)
        );
    },

    /**
     * @return SchedulerInterface
     */
    ServicesAbstract::EXPIRATION_SCHEDULER => static function (ContainerInterface $container) {
        return new ExpirationScheduler(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::CRON),
            $container->get(ServicesAbstract::ERROR),
            $container->get(ServicesAbstract::LOGGER),
            $container->get(ServicesAbstract::DATETIME),
            $container->get(ServicesAbstract::POST_MODEL_FACTORY)
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
    ServicesAbstract::MODULE_WOOCOMMERCE => static function (ContainerInterface $container) {
        return new ModuleWooCommerce(
            $container->get(ServicesAbstract::BASE_URL),
            $container->get(ServicesAbstract::PLUGIN_VERSION)
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
    ServicesAbstract::MODULE_VERSION_NOTICES => static function (ContainerInterface $container) {
        return new ModuleVersionNotices(
            $container->get(ServicesAbstract::BASE_PATH)
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
            $container->get(ServicesAbstract::EXPIRATION_SCHEDULER),
            $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY),
            $container->get(ServicesAbstract::SANITIZATION),
            $container->get(ServicesAbstract::CURRENT_USER_MODEL_FACTORY),
            $container->get(ServicesAbstract::REQUEST)
        );
    },

    /**
     * @return ModuleInterface
     */
    ServicesAbstract::MODULE_SETTINGS => static function (ContainerInterface $container) {
        return new ModuleSettings(
            $container->get(ServicesAbstract::HOOKS),
            $container->get(ServicesAbstract::SETTINGS),
            $container->get(ServicesAbstract::POST_TYPE_SETTINGS_MODEL_FACTORY),
            $container->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY),
            $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL)
        );
    },

    ServicesAbstract::POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        return function ($postId) use ($container) {
            return new PostModel(
                $postId,
                $container->get(ServicesAbstract::TERM_MODEL_FACTORY)
            );
        };
    },

    ServicesAbstract::TERM_MODEL_FACTORY => static function (ContainerInterface $container) {
        return function ($termId) use ($container) {
            return new TermModel($termId);
        };
    },

    ServicesAbstract::USER_MODEL_FACTORY => static function (ContainerInterface $container) {
        return function ($user) use ($container) {
            return new UserModel($user);
        };
    },

    ServicesAbstract::CURRENT_USER_MODEL_FACTORY => static function (ContainerInterface $container) {
        return function () use ($container) {
            return new CurrentUserModel();
        };
    },

    ServicesAbstract::DEFAULT_DATA_MODEL => static function (ContainerInterface $container) {
        return new DefaultDataModel(
            $container->get(ServicesAbstract::SETTINGS),
            $container->get(ServicesAbstract::OPTIONS)
        );
    },

    ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY => static function (ContainerInterface $container) {
        /**
         * @return ExpirablePostModel
         * @throws
         */
        return function ($postId) use ($container) {
            return new ExpirablePostModel(
                $postId,
                $container->get(ServicesAbstract::DEBUG),
                $container->get(ServicesAbstract::OPTIONS),
                $container->get(ServicesAbstract::HOOKS),
                $container->get(ServicesAbstract::USERS),
                $container->get(ServicesAbstract::EXPIRATION_SCHEDULER),
                $container->get(ServicesAbstract::SETTINGS),
                $container->get(ServicesAbstract::EMAIL),
                $container->get(ServicesAbstract::TERM_MODEL_FACTORY),
                $container->get(ServicesAbstract::EXPIRATION_ACTION_FACTORY)
            );
        };
    },

    ServicesAbstract::POST_TYPE_SETTINGS_MODEL_FACTORY => static function (ContainerInterface $container) {
        /**
         * @return SettingsPostTypesModel
         * @throws
         */
        return static function () {
            return new SettingsPostTypesModel();
        };
    },

    ServicesAbstract::TAXONOMIES_MODEL_FACTORY => static function (ContainerInterface $container) {
        /**
         * @return TaxonomiesModel
         * @throws
         */
        return static function () {
            return new TaxonomiesModel();
        };
    },

    ServicesAbstract::EXPIRATION_ACTIONS_MODEL => static function (ContainerInterface $container) {
        return new ExpirationActionsModel(
            $container->get(ServicesAbstract::HOOKS)
        );
    },

    ServicesAbstract::EXPIRATION_ACTION_FACTORY => static function (ContainerInterface $container) {
        return function ($actionName, $postModel) use ($container) {
            switch ($actionName) {
                case ExpirationActionsAbstract::POST_STATUS_TO_DRAFT:
                    return new PostStatusToDraft($postModel);

                case ExpirationActionsAbstract::POST_STATUS_TO_TRASH:
                    return new PostStatusToTrash($postModel);

                case ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE:
                    return new PostStatusToPrivate($postModel);

                case ExpirationActionsAbstract::DELETE_POST:
                    return new DeletePost($postModel);

                case ExpirationActionsAbstract::STICK_POST:
                    return new StickPost($postModel);

                case ExpirationActionsAbstract::UNSTICK_POST:
                    return new UnstickPost($postModel);

                case ExpirationActionsAbstract::POST_CATEGORY_ADD:
                    return new PostCategoryAdd(
                        $postModel,
                        $container->get(ServicesAbstract::ERROR)
                    );

                case ExpirationActionsAbstract::POST_CATEGORY_REMOVE:
                    return new PostCategoryRemove(
                        $postModel,
                        $container->get(ServicesAbstract::ERROR)
                    );

                case ExpirationActionsAbstract::POST_CATEGORY_SET:
                    return new PostCategorySet(
                        $postModel,
                        $container->get(ServicesAbstract::ERROR)
                    );

                default:
                    $hook = $container->get(ServicesAbstract::HOOKS);

                    return $hook->applyFilters(
                        ExpirationHooksAbstract::FILTER_EXPIRATION_ACTION_FACTORY,
                        null,
                        $actionName,
                        $postModel,
                        $container
                    );
            }
        };
    },
];
