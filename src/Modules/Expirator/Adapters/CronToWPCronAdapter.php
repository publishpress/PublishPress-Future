<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Adapters;

use PublishPressFuture\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;

class CronToWPCronAdapter
{
    const IDENTIFIER = 'wp-cron';

    public function getIdentifier()
    {
        return self::IDENTIFIER;
    }

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
    public function clearScheduledAction($action, $args = [])
    {
        return $this->cron->clearScheduledHook($action, $args, false);
    }

    public function postHasScheduledActions($postId)
    {
        $events = $this->getScheduledActions();

        foreach ($events as $event) {
            foreach ($event as $eventValue) {
                $eventValueKeys = array_keys($eventValue);

                foreach ($eventValueKeys as $eventGUID) {
                    if (! empty($eventValue[$eventGUID]['args'])) {
                        if ((int)$eventValue[$eventGUID]['args'][0] === (int)$postId) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    private function getValidHooks()
    {
        return [
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST2,
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST1,
        ];
    }

    public function getScheduledActions()
    {
        $cron = _get_cron_array();
        $events = [];

        $pluginValidHooks = self::getValidHooks();

        foreach ($cron as $time => $value) {
            foreach ($value as $eventKey => $eventValue) {
                if (in_array($eventKey, $pluginValidHooks)) {
                    if (! isset($events[$time])) {
                        $events[$time] = [];
                    }

                    $events[$time][$eventKey] = $eventValue;
                }
            }
        }

        return $events;
    }
}
