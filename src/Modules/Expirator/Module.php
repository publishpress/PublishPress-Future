<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator;


use PublishPress\Future\Framework\InitializableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Framework\WordPress\Facade\SanitizationFacade;
use PublishPressFuture\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Modules\Expirator\Controllers\BulkEditController;
use PublishPressFuture\Modules\Expirator\Controllers\ExpirationController;
use PublishPressFuture\Modules\Expirator\Controllers\ScheduledActionsController;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

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
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface
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
     * @var \PublishPressFuture\Framework\WordPress\Facade\RequestFacade
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
        \Closure $scheduledActionsTableFactory
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
    }

    private function factoryExpirationController()
    {
        return new ExpirationController(
            $this->hooks,
            $this->site,
            $this->cron,
            $this->scheduler,
            $this->expirablePostModelFactory
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
}
