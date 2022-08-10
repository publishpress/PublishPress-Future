<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;


use PublishPressFuture\Framework\Logger\LoggerInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Modules\Expirator\Controllers\Controller;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;

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
     * @var CronFacade
     */
    private $cron;

    /**
     * @var ErrorFacade;
     */
    private $error;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var DateTimeFacade
     */
    private $datetime;

    /**
     * @var Controller
     */
    private $controller;

    /**
     * @var SchedulerInterface
     */
    private $scheduler;

    /**
     * @var callable
     */
    private $expirablePostModelFactory;

    public function __construct($hooks, $site, $cron, $error, $logger, $datetime, $scheduler, $expirablePostModelFactory)
    {
        $this->hooks = $hooks;
        $this->site = $site;
        $this->cron = $cron;
        $this->error = $error;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;

        $this->controller = $this->getController();
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $this->controller->initialize();
    }

    private function getController()
    {
        return new Controller(
            $this->hooks,
            $this->site,
            $this->cron,
            $this->scheduler,
            $this->expirablePostModelFactory
        );
    }
}
