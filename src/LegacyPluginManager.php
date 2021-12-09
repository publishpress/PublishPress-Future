<?php
/**
 * @package     PublishPressFuturePro\
 * @author      PublishPress <help@publishpress.com>
 * @copyright   Copyright (C) 2018 PublishPress. All rights reserved.
 * @license     GPLv2 or later
 * @since       2.8.0
 */

namespace PublishPressFuturePro;

defined('ABSPATH') or die('No direct script access allowed.');

abstract class LegacyPluginManager
{
    public static function isLegacyPluginActivated()
    {
        return defined('POSTEXPIRATOR_VERSION');
    }

    public static function shouldAskToDisableLegacyPlugin()
    {
        if (defined('DOING_AJAX') && DOING_AJAX) {
            return false;
        }

        if (defined('DOING_CRON') && DOING_CRON) {
            return false;
        }

        if (! is_admin()) {
            return false;
        }

        if (self::isLegacyPluginActivated()) {
            return true;
        }

        return false;
    }
}
