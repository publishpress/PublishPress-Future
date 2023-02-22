<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Adapters;

use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;

class CronToWooActionSchedulerAdapter implements CronInterface
{
    const SCHEDULED_ACTION_GROUP = 'publishpress-future';

    /**
     * @inheritDoc
     */
    public function clearScheduledAction($action, $args = [], $wpError = false)
    {
        return as_unschedule_action($action, $args, self::SCHEDULED_ACTION_GROUP);
    }

    /**
     * @inheritDoc
     */
    public function getNextScheduleForAction($action, $args = [])
    {
        return as_next_scheduled_action($action, $args, self::SCHEDULED_ACTION_GROUP);
    }

    /**
     * @inheritDoc
     */
    public function scheduleSingleAction($timestamp, $action, $args = [], $returnWpError = false)
    {
        return as_schedule_single_action($timestamp, $action, $args, self::SCHEDULED_ACTION_GROUP);
    }
}
