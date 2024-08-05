<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Utility functions.
 */
class PostExpirator_Util
{
    /**
     * Check if Block Editor is active.
     * Must only be used after plugins_loaded action is fired.
     *
     * @return bool
     */
    public static function is_gutenberg_active()
    {
        // Gutenberg plugin is installed and activated.
        $gutenberg = ! (false === has_filter('replace_editor', 'gutenberg_init'));

        // Block editor since 5.0.
        $block_editor = version_compare($GLOBALS['wp_version'], '5.0-beta', '>');

        if (! $gutenberg && ! $block_editor) {
            return false;
        }

        if (self::is_classic_editor_plugin_active()) {
            $editor_option = get_option('classic-editor-replace');
            $block_editor_active = array('no-replace', 'block');

            return in_array($editor_option, $block_editor_active, true);
        }

        return true;
    }

    /**
     * Check if Classic Editor plugin is active.
     *
     * @return bool
     */
    private static function is_classic_editor_plugin_active()
    {
        if (! function_exists('is_plugin_active')) {
            include_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        if (is_plugin_active('classic-editor/classic-editor.php')) {
            return true;
        }

        return false;
    }

    public static function wp_timezone_string()
    {
        $tzString = wp_timezone_string();

        if (substr_count($tzString, ':')) {
            $tzString = 'UTC ' . $tzString;
        }

        return $tzString;
    }

    public static function get_timezone_offset()
    {
        $timezone = wp_timezone();

        return $timezone->getOffset(new DateTime());
    }

    /**
     * @deprecated 2.8.0 Use PublishPress\Future/Core/Helper/Date::getWpDate instead
     */
    public static function get_wp_date($format, $timestamp)
    {
        $container = Container::getInstance();

        return $container->get(ServicesAbstract::DATETIME)->getWpDate($format, $timestamp);
    }

    public static function sanitize_array_of_integers($array)
    {
        return array_map('intval', (array)$array);
    }
}
