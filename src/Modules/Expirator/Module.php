<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;

use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;
use PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade;
use PublishPress\Future\Framework\WordPress\Facade\SiteFacade;
use PublishPress\Future\Modules\Expirator\Controllers\BulkActionController;
use PublishPress\Future\Modules\Expirator\Controllers\BulkEditController;
use PublishPress\Future\Modules\Expirator\Controllers\ClassicEditorController;
use PublishPress\Future\Modules\Expirator\Controllers\ExpirationController;
use PublishPress\Future\Modules\Expirator\Controllers\QuickEditController;
use PublishPress\Future\Modules\Expirator\Controllers\ScheduledActionsController;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;

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
        $this->controllers['quick_edit'] = $this->factoryQuickEditController();
        $this->controllers['bulk_edit'] = $this->factoryBulkEditController();
        $this->controllers['bulk_action'] = $this->factoryBulkActionController();
        $this->controllers['scheduled_actions'] = $this->factoryScheduledActionsController();
        $this->controllers['classic_editor'] = $this->factoryClassicEditorController();
        $this->controllers['shortcode'] = $this->factoryShortcodeController();
    }


    /**
     * @inheritDoc
     */
    public function initialize()
    {
        foreach ($this->controllers as $controller) {
            $controller->initialize();
        }
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

    private function factoryQuickEditController()
    {
        return new QuickEditController(
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

    private function factoryClassicEditorController()
    {
        return new ClassicEditorController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request
        );
    }

    private function factoryShortcodeController()
    {
        return new Controllers\ShortcodeController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request
        );
    }
}
