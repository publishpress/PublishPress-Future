<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Adapters;

use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;

class CronToWooActionSchedulerAdapter implements CronInterface
{
    public const SCHEDULED_ACTION_GROUP = 'publishpress-future';

    public const IDENTIFIER = 'woo-action-scheduler';

    public function getIdentifier(): string
    {
        return self::IDENTIFIER;
    }

    /**
     * @inheritDoc
     */
    public function clearScheduledAction($action, $args = [])
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
    public function scheduleSingleAction($timestamp, $action, $args = [])
    {
        return as_schedule_single_action($timestamp, $action, $args, self::SCHEDULED_ACTION_GROUP);
    }

    public function postHasScheduledActions($postId): bool
    {
        $events = $this->getScheduledActions(HooksAbstract::ACTION_RUN_WORKFLOW);

        foreach ($events as $event) {
            if ((int)$event->get_args()['postId'] === (int)$postId) {
                return true;
            }
        }

        return false;
    }

    public function getScheduledActions(string $hook): array
    {
        $args = [
            'group' => self::SCHEDULED_ACTION_GROUP,
            'status' => \ActionScheduler_Store::STATUS_PENDING,
            'per_page' => -1,
        ];

        if (! empty($hook)) {
            $args['hook'] = $hook;
        }

        return as_get_scheduled_actions($args);
    }

    public function enqueueAsyncAction(string $action, array $args = [], bool $unique = false): int
    {
        return as_enqueue_async_action($action, $args, self::SCHEDULED_ACTION_GROUP, $unique);
    }
}
