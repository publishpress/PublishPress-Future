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
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Framework\WordPress\Facade\RequestFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface;
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
     * @var RequestFacade
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
     * @var NoticeFacade
     */
    private $noticesFacade;


    public function __construct(
        \PublishPress\Future\Core\HookableInterface $hooks,
        SiteFacade $site,
        CronInterface $cron,
        SchedulerInterface $scheduler,
        \Closure $expirablePostModelFactory,
        SanitizationFacade $sanitization,
        \Closure $currentUserModelFactory,
        $request,
        \Closure $actionArgsModelFactory,
        \Closure $scheduledActionsTableFactory,
        NoticeFacade $noticesFacade
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
        $this->noticesFacade = $noticesFacade;

        $this->controllers['expiration'] = $this->factoryExpirationController();
        $this->controllers['quick_edit'] = $this->factoryQuickEditController();
        $this->controllers['bulk_edit'] = $this->factoryBulkEditController();
        $this->controllers['bulk_action'] = $this->factoryBulkActionController();
        $this->controllers['scheduled_actions'] = $this->factoryScheduledActionsController();
        $this->controllers['classic_editor'] = $this->factoryClassicEditorController();
        $this->controllers['block_editor'] = $this->factoryBlockController();
        $this->controllers['shortcode'] = $this->factoryShortcodeController();
        $this->controllers['posts_list'] = $this->factoryPostsListController();
        $this->controllers['content'] = $this->factoryContentController();
        $this->controllers['plugins_list'] = $this->factoryPluginsListController();
        $this->controllers['rest_api'] = $this->factoryRestAPIController();
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
        return new Controllers\ExpirationController(
            $this->hooks,
            $this->scheduler,
            $this->expirablePostModelFactory
        );
    }

    private function factoryBulkEditController()
    {
        return new Controllers\BulkEditController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request
        );
    }

    private function factoryQuickEditController()
    {
        return new Controllers\QuickEditController($this->hooks);
    }

    private function factoryScheduledActionsController()
    {
        return new Controllers\ScheduledActionsController (
            $this->hooks,
            $this->actionArgsModelFactory,
            $this->scheduledActionsTableFactory
        );
    }

    private function factoryBulkActionController()
    {
        return new Controllers\BulkActionController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->noticesFacade
        );
    }

    private function factoryClassicEditorController()
    {
        return new Controllers\ClassicEditorController(
            $this->hooks,
            $this->currentUserModelFactory
        );
    }

    private function factoryShortcodeController()
    {
        return new Controllers\ShortcodeController();
    }

    private function factoryPostsListController()
    {
        return new Controllers\PostListController($this->hooks);
    }

    private function factoryContentController()
    {
        return new Controllers\ContentController($this->hooks);
    }

    private function factoryPluginsListController()
    {
        return new Controllers\PluginsListController($this->hooks);
    }

    private function factoryRestAPIController()
    {
        return new Controllers\RestAPIController(
            $this->hooks,
            $this->expirablePostModelFactory
        );
    }

    private function factoryBlockController()
    {
        return new Controllers\BlockEditorController($this->hooks);
    }
}
