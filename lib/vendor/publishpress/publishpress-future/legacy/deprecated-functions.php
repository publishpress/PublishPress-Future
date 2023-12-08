<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;

defined('ABSPATH') or die('Direct access not allowed.');

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

if (! function_exists('_postexpirator_expire_type')) {
    /**
     * Get the HTML for expire type.
     *
     * @internal
     *
     * @access private
     * @deprecated 3.1.4
     */
    function _postexpirator_expire_type($opts)
    {
        if (empty($opts)) {
            return false;
        }

        PostExpirator_Display::getInstance()->render_template('how-to-expire', array('opts' => $opts));
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
        ExpiratorHooks::ACTION_RUN_WORKFLOW,
        $postId
    );
}

/**
 * Called at plugin activation
 *
 * @internal
 *
 * @access private
 * @deprecated 2.8.0
 */
function postexpirator_activate()
{
    _deprecated_function(__METHOD__, '2.8.0', 'Moved to the module Settings');
}

/**
 * Called at plugin deactivation
 *
 * @internal
 *
 * @access private
 *
 * @deprecated 2.8.0
 */
function expirationdate_deactivate()
{
    _deprecated_function(__METHOD__, '2.8.0', 'Moved to the PublishPress\Future\Framework\PluginFacade class.');
}


/**
 * Get the HTML for taxonomy.
 *
 * @internal
 *
 * @access private
 * @deprecated 3.1.4
 */
function _postexpirator_taxonomy($opts)
{
    if (empty($opts)) {
        return false;
    }

    if (! isset($opts['name'])) {
        return false;
    }

    $name = sanitize_text_field($opts['name']);

    if (! isset($id)) {
        $id = $name;
    }

    $disabled = false;
    if (isset($opts['disabled'])) {
        $disabled = (bool)$opts['disabled'];
    }

    $onchange = '';
    if (isset($opts['onchange'])) {
        $onchange = sanitize_text_field($opts['onchange']);
    }

    $type = '';
    if (isset($opts['type'])) {
        $type = sanitize_text_field($opts['type']);
    }

    $selected = false;
    if (isset($opts['selected'])) {
        $selected = $opts['selected'];
    }

    $taxonomies = get_object_taxonomies($type, 'object');
    $taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));

    if (empty($taxonomies)) {
        return esc_html__('No taxonomies found', 'post-expirator');
    }

    $params = [
        'name' => $name,
        'id' => $id,
        'disabled' => $disabled,
        'taxonomies' => $taxonomies,
        'selected' => $selected,
        'onchange' => $onchange
    ];

    return PostExpirator_Display::getInstance()->get_rendered_template('taxonomy-field', $params);
}

if (! function_exists('postexpirator_get_post_types')) {
    /**
     * @deprecated 3.1.4
     */
    function postexpirator_get_post_types(): array
    {
        _deprecated_function(__FUNCTION__, '3.1.4', 'Use the PostTypesModel class instead');

        $model = new PostTypesModel(Container::getInstance());

        return $model->getPostTypes();
    }
}
