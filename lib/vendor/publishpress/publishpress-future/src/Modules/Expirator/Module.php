<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;


use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade;
use PublishPress\Future\Framework\WordPress\Facade\SiteFacade;
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
        \Closure $settingsModelFactory
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

        $this->controllers['expiration'] = $this->factoryExpirationController();
        $this->controllers['bulk_edit'] = $this->factoryBulkEditController();
        $this->controllers['scheduled_actions'] = $this->factoryScheduledActionsController();
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
            $this->settingsModelFactory
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


        wp_enqueue_script(
            'publishpress-future-expirator',
            POSTEXPIRATOR_BASEURL . 'assets/js/expirator-classic-editor.js',
            ['jquery'],
            PUBLISHPRESS_FUTURE_VERSION,
            true
        );
    }
}
