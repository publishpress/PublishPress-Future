<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

use WP_Error;

class CronFacade
{
    /**
     * Undocumented function
     *
     * @param string $hook
     * @param array $args
     * @param bool $wpError
     * @return int|WP_Error|false
     */
    public function clearScheduledHook($hook, $args = [], $wpError = false)
    {
        return \wp_clear_scheduled_hook($hook, $args, $wpError);
    }

    /**
     * @param string $hook
     * @param array $args
     * @return false|int
     */
    public function getNextScheduleForEvent($hook, $args = [])
    {
        return \wp_next_scheduled($hook, $args);
    }

    /**
     * @param int $timestamp
     * @param string $hook
     * @param array $args
     * @param bool $returnWpError
     * @return bool|WP_Error
     */
    public function scheduleSingleEvent($timestamp, $hook, $args = [], $returnWpError = false)
    {
        return \wp_schedule_single_event($timestamp, $hook, $args, $returnWpError);
    }
}
