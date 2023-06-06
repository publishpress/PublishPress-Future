<?php
/**
 * @copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

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
     * @return int
     */
    public function scheduleSingleAction($timestamp, $action, $args = []);

    /**
     * @param int $postId
     * @return true
     */
    public function postHasScheduledActions($postId);

    /**
     * @param string $hook
     * @return array
     */
    public function getScheduledActions($hook);

    /**
     * @param string $action
     * @param array $args
     * @param bool $unique
     * @return int
     */
    public function enqueueAsyncAction($action, $args = [], $unique = false);

    /**
     * @param string $group
     * @return mixed
     */
    public function cancelActionsByGroup($group);
}
