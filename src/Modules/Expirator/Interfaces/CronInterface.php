<?php
/**
 * @copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Interfaces;

interface CronInterface
{
    /**
     * @param string $action
     * @param array $args
     * @param bool $wpError
     * @return int|\WP_Error|false
     */
    public function clearScheduledAction($action, $args = [], $wpError = false);

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
     * @param bool $returnWpError
     * @return bool|\WP_Error
     */
    public function scheduleSingleAction($timestamp, $action, $args = [], $returnWpError = false);
}
