<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Adapters;

use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;

defined('ABSPATH') or die('Direct access not allowed.');

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
    public function scheduleSingleAction($timestamp, $action, $args = []): int
    {
        return as_schedule_single_action($timestamp, $action, $args, self::SCHEDULED_ACTION_GROUP);
    }

    public function postHasScheduledActions($postId): bool
    {
        return as_has_scheduled_action(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire'], self::SCHEDULED_ACTION_GROUP);
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

    public function cancelActionsByGroup(string $group)
    {
        as_unschedule_all_actions('', [], $group);
    }
}
