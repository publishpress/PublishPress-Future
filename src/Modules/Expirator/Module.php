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

    public function __construct($hooks, $site, $cron, $error, $logger, $datetime)
    {
        $this->hooks = $hooks;
        $this->site = $site;
        $this->cron = $cron;
        $this->error = $error;
        $this->logger = $logger;
        $this->datetime = $datetime;

        $controller = $this->getController();
        $controller->initialize();
    }

    /**
     * @return \PublishPressFuture\Modules\Expirator\Scheduler
     */
    private function getScheduler()
    {
        return new Scheduler(
            $this->hooks,
            $this->cron,
            $this->error,
            $this->logger,
            $this->datetime
        );
    }

    private function getController()
    {
        return new Controller(
            $this->hooks,
            $this->site,
            $this->cron,
            $this->getScheduler()
        );
    }
}
