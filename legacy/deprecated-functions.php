<?php

use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooks;

if (! function_exists('_scheduleExpiratorEvent')) {
    /**
     * Schedules the single event.
     *
     * @deprecated 2.4.3
     */
    function _scheduleExpiratorEvent($id, $ts, $opts)
    {
        _deprecated_function(__FUNCTION__, '2.4.3', 'postexpirator_schedule_event');
        postexpirator_schedule_event($id, $ts, $opts);
    }
}


if (! function_exists('_unscheduleExpiratorEvent')) {
    /**
     * Unschedules the single event.
     *
     * @deprecated 2.4.3
     */
    function _unscheduleExpiratorEvent($id)
    {
        _deprecated_function(__FUNCTION__, '2.4.3', 'postexpirator_unschedule_event');
        postexpirator_unschedule_event($id);
    }
}


if (! function_exists('postExpiratorExpire')) {
    /**
     * Expires the post.
     *
     * @deprecated 2.4.3
     */
    function postExpiratorExpire($id)
    {
        _deprecated_function(__FUNCTION__, '2.4.3', 'postexpirator_expire_post');
        postexpirator_expire_post($id);
    }
}


if (! function_exists('_postExpiratorExpireType')) {
    /**
     * Get the HTML for expire type.
     *
     * @deprecated 2.5.0
     */
    function _postExpiratorExpireType($opts)
    {
        _deprecated_function(__FUNCTION__, '2.5.0', '_postexpirator_expire_type');

        ob_start();
        _postexpirator_expire_type($opts);

        return ob_get_clean();
    }
}

if (! function_exists('expirationdate_get_blog_url')) {
    /**
     * Get correct URL (HTTP or HTTPS)
     *
     * @internal
     * @access private
     *
     * @deprecated 2.7.1
     */
    function expirationdate_get_blog_url()
    {
        _deprecated_function(__FUNCTION__, '2.7.1');

        if (is_multisite()) {
            $url = network_home_url('/');
        } else {
            $url = home_url('/');
        }

        echo esc_url($url);
    }
}

/**
 * Schedules the single event.
 *
 * @deprecated 2.8.0
 * @internal
 *
 * @access private
 */
function postexpirator_schedule_event($postId, $timestamp, $opts)
{
    do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $timestamp, $opts);
}

/**
 * Unschedules the single event.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.8.0
 */
function postexpirator_unschedule_event($postId)
{
    do_action(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
}


/**
 * Show the menu.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_menu()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
}

/**
 * Hook's to add plugin page menu
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_add_menu()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
}

/**
 * Show the Expiration Date options page
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_menu_general()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
    PostExpirator_Display::getInstance()->load_tab('general');
}

/**
 * The default menu.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_menu_defaults()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
    PostExpirator_Display::getInstance()->load_tab('defaults');
}

/**
 * Diagnostics menu.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_menu_diagnostics()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
    PostExpirator_Display::getInstance()->load_tab('diagnostics');
}

/**
 * Debug menu.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.5.0
 */
function postexpirator_menu_debug()
{
    _deprecated_function(__FUNCTION__, '2.5.0');
    PostExpirator_Display::getInstance()->load_tab('viewdebug');
}

/**
 * Check for Debug
 *
 * @internal
 *
 * @access private
 * @deprecated 2.8.0
 */
function postexpirator_debug()
{
    _deprecated_function(__FUNCTION__, '2.8.0');

    $debug = get_option('expirationdateDebug');

    // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
    if ($debug == 1) {
        if (! defined('POSTEXPIRATOR_DEBUG')) {
            define('POSTEXPIRATOR_DEBUG', 1);
        }

        require_once POSTEXPIRATOR_LEGACYDIR . '/debug.php';

        return new PostExpiratorDebug();
    } else {
        if (! defined('POSTEXPIRATOR_DEBUG')) {
            /**
             * @deprecated
             */
            define('POSTEXPIRATOR_DEBUG', 0);
        }

        return false;
    }
}

/**
 * Internal method to get category names corresponding to the category IDs.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.8.0
 */
function _postexpirator_get_cat_names($cats)
{
    $out = array();
    foreach ($cats as $cat) {
        $out[$cat] = get_the_category_by_id($cat);
    }

    return $out;
}

/**
 * @param $id
 * @param $log
 * @return void
 * @deprecated 2.8.0
 */
function postexpirator_register_expiration_meta($id, $log)
{
    $log['expired_on'] = date('Y-m-d H:i:s');

    add_post_meta($id, 'expiration_log', wp_json_encode($log));
}

/**
 * The new expiration function, to work with single scheduled events.
 *
 * This was designed to hopefully be more flexible for future tweaks/modifications to the architecture.
 *
 * @internal
 *
 * @access private
 * @deprecated 2.8.0
 */
function postexpirator_expire_post($postId)
{
    do_action(
        ExpiratorHooks::ACTION_EXPIRE_POST,
        $postId
    );
}
