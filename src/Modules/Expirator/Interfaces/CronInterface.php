<?php
/**
 * @copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Interfaces;

interface CronInterface
{
    /**
     * @return string
     */
    public function getIdentifier();

    /**
     * @param string $action
     * @param array $args
     * @return int|\WP_Error|false
     */
    public function clearScheduledAction($action, $args = []);

    /**
     * @param string $action
     * @param array $args
     * @return false|int
     */
    public function getNextScheduleForAction($action, $args = []);

    /**
     * @param int $timestamp
     * @param string $action
     * @param array $args
     * @return bool|\WP_Error
     */
    public function scheduleSingleAction($timestamp, $action, $args = []);

    /**
     * @param int $postId
     * @return true
     */
    public function postHasScheduledActions($postId);

    /**
     * @return array
     */
    public function getScheduledActions(string $hook): array;

    public function enqueueAsyncAction(string $action, array $args = [], bool $unique = false): int;

    public function cancelActionsByGroup(string $group);
}
