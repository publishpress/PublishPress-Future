<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator;


use PublishPressFuture\Core\Framework\Logger\LoggerInterface;
use PublishPressFuture\Core\Framework\ModuleInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\DateTimeFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\ErrorFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Modules\Expirator\Controllers\Controller;
use PublishPressFuture\Modules\Expirator\Interfaces\RunnerInterface;
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
     * @var RunnerInterface
     */
    private $runner;

    /**
     * @var SchedulerInterface
     */
    private $scheduler;

    public function __construct($hooks, $site, $cron, $error, $logger, $datetime, $runner, $scheduler)
    {
        $this->hooks = $hooks;
        $this->site = $site;
        $this->cron = $cron;
        $this->error = $error;
        $this->logger = $logger;
        $this->datetime = $datetime;
        $this->runner = $runner;
        $this->scheduler = $scheduler;

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
            $this->runner,
            $this->scheduler
        );
    }
}
