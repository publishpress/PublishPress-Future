<?php

/**
 * Utility functions.
 */
class PostExpirator_CronFacade
{
    /**
     * @return array
     */
    public static function get_plugin_cron_events()
    {
        $cron = _get_cron_array();
        $events = [];

        $plugin_valid_events = self::get_valid_events();

        foreach ($cron as $time => $value) {
            foreach ($value as $event_key => $event_value) {
                if (in_array($event_key, $plugin_valid_events)) {
                    if (! isset($events[$time])) {
                        $events[$time] = [];
                    }

                    $events[$time][$event_key] = $event_value;
                }
            }
        }

        return $events;
    }

    /**
     * @return bool
     */
    public static function is_cron_enabled()
    {
        return ! defined('DISABLE_WP_CRON') || DISABLE_WP_CRON == false;
    }

    private static function get_valid_events()
    {
        return [
            'postExpiratorExpire',
        ];
    }
}
