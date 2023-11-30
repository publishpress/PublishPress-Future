<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;
use PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade;
use PublishPress\Future\Framework\WordPress\Facade\SiteFacade;
use PublishPress\Future\Modules\Expirator\Controllers\BulkActionController;
use PublishPress\Future\Modules\Expirator\Controllers\BulkEditController;
use PublishPress\Future\Modules\Expirator\Controllers\ExpirationController;
use PublishPress\Future\Modules\Expirator\Controllers\ScheduledActionsController;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var HooksFacade;
     */
    private $hooks;

    /**
     * @var SiteFacade
     */
    private $site;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface
     */
    private $cron;

    /**
     * @var InitializableInterface[]
     */
    private $controllers = [];

    /**
     * @var SchedulerInterface
     */
    private $scheduler;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var SanitizationFacade
     */
    private $sanitization;

    /**
     * @var \Closure
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @var \Closure
     */
    private $actionArgsModelFactory;

    /**
     * @var \Closure
     */
    private $scheduledActionsTableFactory;

    /**
     * @var \Closure
     */
    private $settingsModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\NoticeFacade
     */
    private $noticesFacade;

    /**
     * @var \Closure
     */
    private $taxonomiesModelFactory;

    public function __construct(
        $hooks,
        $site,
        $cron,
        $scheduler,
        $expirablePostModelFactory,
        $sanitization,
        $currentUserModelFactory,
        $request,
        \Closure $actionArgsModelFactory,
        \Closure $scheduledActionsTableFactory,
        \Closure $settingsModelFactory,
        NoticeFacade $noticesFacade,
        \Closure $taxonomiesModelFactory
    ) {
        $this->hooks = $hooks;
        $this->site = $site;
        $this->cron = $cron;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->sanitization = $sanitization;
        $this->currentUserModelFactory = $currentUserModelFactory;
        $this->request = $request;
        $this->actionArgsModelFactory = $actionArgsModelFactory;
        $this->scheduledActionsTableFactory = $scheduledActionsTableFactory;
        $this->settingsModelFactory = $settingsModelFactory;
        $this->noticesFacade = $noticesFacade;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;

        $this->controllers['expiration'] = $this->factoryExpirationController();
        $this->controllers['bulk_edit'] = $this->factoryBulkEditController();
        $this->controllers['scheduled_actions'] = $this->factoryScheduledActionsController();
        $this->controllers['bulk_action'] = $this->factoryBulkActionController();
    }


    /**
     * @inheritDoc
     */
    public function initialize()
    {
        foreach ($this->controllers as $controller) {
            $controller->initialize();
        }

        $this->hooks->addAction('admin_enqueue_scripts', [$this, 'enqueueScripts']);
    }

    private function factoryExpirationController()
    {
        return new ExpirationController(
            $this->hooks,
            $this->site,
            $this->cron,
            $this->scheduler,
            $this->expirablePostModelFactory,
            $this->settingsModelFactory,
            $this->taxonomiesModelFactory
        );
    }

    private function factoryBulkEditController()
    {
        return new BulkEditController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request
        );
    }

    private function factoryScheduledActionsController()
    {
        return new ScheduledActionsController (
            $this->hooks,
            $this->actionArgsModelFactory,
            $this->scheduledActionsTableFactory
        );
    }

    private function factoryBulkActionController()
    {
        return new BulkActionController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request,
            $this->noticesFacade
        );
    }

    public function enqueueScripts()
    {
        $currentScreen = get_current_screen();

        if ($currentScreen->base !== 'post') {
            return;
        }

        $isNewPostPage = $currentScreen->action === 'add';
        $isEditPostPage = ! empty($_GET['action']) && ($_GET['action'] === 'edit'); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        if (! $isEditPostPage && ! $isNewPostPage) {
            return;
        }

        $currentUserModelFactory = $this->currentUserModelFactory;
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);
        $actionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
        $postType = $currentScreen->post_type;

        $postTypeDefaultConfig = $settingsFacade->getPostTypeDefaults($postType);

        if (! in_array((string)$postTypeDefaultConfig['activeMetaBox'], ['active', '1', true])) {
            return;
        }

        wp_enqueue_script(
            'publishpress-future-classic-editor',
            POSTEXPIRATOR_BASEURL . 'assets/js/classic-editor.js',
            ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element'],
            PUBLISHPRESS_FUTURE_VERSION,
            true
        );

        wp_enqueue_style(
            'publishpress-future-classic-editor',
            POSTEXPIRATOR_BASEURL . 'assets/css/edit.css',
            ['wp-components'],
            PUBLISHPRESS_FUTURE_VERSION
        );

        $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
        $defaultDataModel = $defaultDataModelFactory->create($postType);

        $debug = $container->get(ServicesAbstract::DEBUG);

        $taxonomyName= '';
        if (! empty($postTypeDefaultConfig['taxonomy'])) {
            $taxonomy = get_taxonomy($postTypeDefaultConfig['taxonomy']);
            $taxonomyName = $taxonomy->label;
        }

        $taxonomyTerms = [];
        if (! empty($postTypeDefaultConfig['taxonomy'])) {
            $taxonomyTerms = get_terms([
                'taxonomy' => $postTypeDefaultConfig['taxonomy'],
                'hide_empty' => false,
            ]);
        }

        $defaultExpirationDate = $defaultDataModel->getActionDateParts();

        wp_localize_script(
            'publishpress-future-classic-editor',
            'publishpressFutureClassicMetabox',
            [
                'postTypeDefaultConfig' => $postTypeDefaultConfig,
                'defaultDate' => $defaultExpirationDate['iso'],
                'is12hours' => get_option('time_format') !== 'H:i',
                'startOfWeek' => get_option('start_of_week', 0),
                'actionsSelectOptions' => $actionsModel->getActionsAsOptions($postType),
                'isDebugEnabled' => $debug->isEnabled(),
                'taxonomyName' => $taxonomyName,
                'taxonomyTerms' => $taxonomyTerms,
                'postType' => $currentScreen->post_type,
                'isNewPost' => $isNewPostPage,
                'strings' => [
                    'category' => __('Taxonomy', 'post-expirator'),
                    'panelTitle' => __('PublishPress Future', 'post-expirator'),
                    'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                    'action' => __('Action', 'post-expirator'),
                    'loading' => __('Loading', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'noTermsFound' => sprintf(
                        __('No %s found.', 'post-expirator'),
                        strtolower($taxonomyName)
                    ),
                    'noTaxonomyFound' => __('You must assign a hierarchical taxonomy to this post type to use this feature.', 'post-expirator'),
                ]
            ]
        );
    }
}
