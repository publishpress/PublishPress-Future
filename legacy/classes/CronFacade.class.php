<?php

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooks;

/**
 * Utility functions.
 */
class PostExpirator_CronFacade
{
    /**
     * @return array
     * @deprecated
     */
    public static function get_plugin_cron_events()
    {
        $container = Container::getInstance();
        $cron      = $container->get(ServicesAbstract::CRON);
        return $cron->getScheduledActions(ExpiratorHooks::ACTION_LEGACY_EXPIRE_POST2);
    }

    /**
     * @return bool
     */
    public static function is_cron_enabled()
    {
        return ! defined('DISABLE_WP_CRON') || DISABLE_WP_CRON == false;
    }

    /**
     * @deprecated
     */
    public static function post_has_scheduled_task($post_id)
    {
        $container = Container::getInstance();
        $cron      = $container->get(ServicesAbstract::CRON);
        return $cron->postHasScheduledActions($post_id);
    }
}
