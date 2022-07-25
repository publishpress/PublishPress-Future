<?php

namespace PublishPressFuture\Core\WordPress;

use WP_Error;

class CronFacade
{
    /**
     * Undocumented function
     *
     * @param string $hook
     * @param array $args
     * @param boolean $wpError
     * @return int|WP_Error|false
     */
    public function clearScheduledHook($hook, $args = [], $wpError = false)
    {
        return wp_clear_scheduled_hook($hook, $args, $wpError);
    }
}
