<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Adapters;

use PublishPressFuture\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;

class CronToWPCronAdapter implements CronInterface
{
    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\CronFacade
     */
    private $cron;

    public function __construct()
    {
        $this->cron = new CronFacade();
    }

    /**
     * @inheritDoc
     */
    public function clearScheduledAction($action, $args = [], $wpError = false)
    {
        return $this->cron->clearScheduledHook($action, $args, $wpError);
    }

    /**
     * @inheritDoc
     */
    public function getNextScheduleForAction($action, $args = [])
    {
        return $this->cron->getNextScheduleForHook($action, $args);
    }

    /**
     * @inheritDoc
     */
    public function scheduleSingleAction($timestamp, $action, $args = [], $returnWpError = false)
    {
        return $this->cron->scheduleSingleEventForHook($timestamp, $action, $args, $returnWpError);
    }
}
