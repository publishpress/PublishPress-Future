<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Adapters;

use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;

use function as_enqueue_async_action;
use function as_get_scheduled_actions;
use function as_has_scheduled_action;
use function as_next_scheduled_action;
use function as_schedule_single_action;
use function as_unschedule_action;
use function as_unschedule_all_actions;

defined('ABSPATH') or die('Direct access not allowed.');

class CronToWooActionSchedulerAdapter implements CronInterface
{
    const SCHEDULED_ACTION_GROUP = 'publishpress-future';

    const IDENTIFIER = 'woo-action-scheduler';

    /**
     * @return string
     */
    public function getIdentifier()
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

    /**
     * @param $postId
     * @return bool
     */
    public function postHasScheduledActions($postId)
    {
        $hasScheduledActions = as_has_scheduled_action(HooksAbstract::ACTION_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire'], self::SCHEDULED_ACTION_GROUP);

        if (! $hasScheduledActions) {
            // Try checking with the legacy hook.
            $hasScheduledActions = as_has_scheduled_action(HooksAbstract::ACTION_LEGACY_RUN_WORKFLOW, ['postId' => $postId, 'workflow' => 'expire'], self::SCHEDULED_ACTION_GROUP);
        }

        return $hasScheduledActions;
    }

    /**
     * @param string $hook
     * @return array
     */
    public function getScheduledActions($hook)
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

    /**
     * @param $action
     * @param array $args
     * @param $unique
     * @return int
     */
    public function enqueueAsyncAction($action, $args = [], $unique = false)
    {
        return as_enqueue_async_action($action, $args, self::SCHEDULED_ACTION_GROUP, $unique);
    }

    /**
     * @param string $group
     * @return void
     */
    public function cancelActionsByGroup($group)
    {
        as_unschedule_all_actions('', [], $group);
    }
}
