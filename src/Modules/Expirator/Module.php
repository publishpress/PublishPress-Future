<?php

/**
 * Copyright (c) 2024, Ramble Ventures
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
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\System\DateTimeHandlerInterface;
use PublishPress\Future\Modules\Expirator\Models\PostTypeDefaultDataModelFactory;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
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

    /**
     * @var DBTableSchemaInterface
     */
    private $actionArgsSchema;

    /**
     * @var SettingsFacade
     */
    private $settingsFacade;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var DateTimeHandlerInterface
     */
    private $dateTimeHandler;

    /**
     * @var PostTypeDefaultDataModelFactory
     */
    private $defaultDataModelFactory;

    /**
     * @var \Closure
     */
    private $taxonomiesModelFactory;

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
        NoticeFacade $noticesFacade,
        DBTableSchemaInterface $actionArgsSchema,
        SettingsFacade $settingsFacade,
        LoggerInterface $logger,
        DateTimeHandlerInterface $dateTimeHandler,
        PostTypeDefaultDataModelFactory $defaultDataModelFactory,
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
        $this->noticesFacade = $noticesFacade;
        $this->actionArgsSchema = $actionArgsSchema;
        $this->settingsFacade = $settingsFacade;
        $this->logger = $logger;
        $this->dateTimeHandler = $dateTimeHandler;
        $this->defaultDataModelFactory = $defaultDataModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;

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
            $this->expirablePostModelFactory,
            $this->logger
        );
    }

    private function factoryBulkEditController()
    {
        return new Controllers\BulkEditController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->sanitization,
            $this->currentUserModelFactory,
            $this->request,
            $this->logger
        );
    }

    private function factoryQuickEditController()
    {
        return new Controllers\QuickEditController(
            $this->hooks,
            $this->currentUserModelFactory,
            $this->logger
        );
    }

    private function factoryScheduledActionsController()
    {
        return new Controllers\ScheduledActionsController(
            $this->hooks,
            $this->actionArgsModelFactory,
            $this->scheduledActionsTableFactory,
            $this->settingsFacade,
            $this->logger
        );
    }

    private function factoryBulkActionController()
    {
        return new Controllers\BulkActionController(
            $this->hooks,
            $this->expirablePostModelFactory,
            $this->noticesFacade,
            $this->currentUserModelFactory
        );
    }

    private function factoryClassicEditorController()
    {
        return new Controllers\ClassicEditorController(
            $this->hooks,
            $this->currentUserModelFactory,
            $this->logger
        );
    }

    private function factoryShortcodeController()
    {
        return new Controllers\ShortcodeController($this->hooks);
    }

    private function factoryPostsListController()
    {
        return new Controllers\PostListController(
            $this->hooks,
            $this->actionArgsSchema,
            $this->logger
        );
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
            $this->expirablePostModelFactory,
            $this->currentUserModelFactory,
            $this->logger,
            $this->dateTimeHandler,
            $this->taxonomiesModelFactory
        );
    }

    private function factoryBlockController()
    {
        return new Controllers\BlockEditorController(
            $this->hooks,
            $this->currentUserModelFactory
        );
    }
}
