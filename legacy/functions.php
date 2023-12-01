<?php

/**
 * This file provides access to all legacy functions that are now deprecated.
 */

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Migrations\V30000ActionArgsSchema;
use PublishPress\Future\Modules\Expirator\Migrations\V30000ReplaceFooterPlaceholders;
use PublishPress\Future\Modules\Expirator\Migrations\V30000WPCronToActionsScheduler;
use PublishPress\Future\Modules\Expirator\Migrations\V30001RestorePostMeta;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Adds links to the plugin listing screen.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_plugin_action_links($links, $file)
{
    $this_plugin = basename(plugin_dir_url(__FILE__)) . '/post-expirator.php';
    if ($file === $this_plugin) {
        $links[] = '<a href="admin.php?page=publishpress-future">' . __('Settings', 'post-expirator') . '</a>';
    }

    return $links;
}

add_filter('plugin_action_links', 'postexpirator_plugin_action_links', 10, 2);


/**
 * Adds an 'Future action' column to the post display table.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_add_column($columns, $postType = 'page')
{
    $container = Container::getInstance();
    $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

    $defaults = $settingsFacade->getPostTypeDefaults($postType);

    // If settings are not configured, show the metabox by default only for posts and pages
    if ((! isset($defaults['activeMetaBox']) && in_array($postType, array(
                'post',
                'page'
            ), true)) || (is_array(
                $defaults
            ) && in_array((string)$defaults['activeMetaBox'], ['active', '1']))) {
        $columns['expirationdate'] = __('Future Action', 'post-expirator');
    }

    return $columns;
}

add_filter('manage_posts_columns', 'postexpirator_add_column', 10, 2);
add_filter('manage_pages_columns', 'postexpirator_add_column', 11, 1);

/**
 * Adds sortable columns.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_manage_sortable_columns()
{
    $post_types = postexpirator_get_post_types();
    foreach ($post_types as $post_type) {
        add_filter('manage_edit-' . $post_type . '_sortable_columns', 'postexpirator_sortable_column');
    }
}

add_action('admin_init', 'postexpirator_manage_sortable_columns', 100);

/**
 * Adds an 'Future Action' column to the post display table.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_sortable_column($columns)
{
    $columns['expirationdate'] = 'expirationdate';

    return $columns;
}

/**
 * Modify the sorting of posts.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_orderby($orderBy, $query)
{
    if (! is_admin()  || ! $query->is_main_query()) {
        return $orderBy;
    }

    if ('expirationdate' === $query->get('orderby')) {
        $order = strtoupper($query->get('order'));

        if (! in_array($order, [
            'ASC',
            'DESC'
        ], true)) {
            $order = 'ASC';
        }

        $orderBy = ActionArgsSchema::getTableName() . '.scheduled_date ' . $order;
    }

    return $orderBy;
}

add_action('posts_orderby', 'postexpirator_orderby', 10, 2);


function postexpirator_posts_join($join, $query)
{
    global $wpdb;

    if (! is_admin() || ! $query->is_main_query()) {
        return $join;
    }

    $actionArgsSchemaTableName = ActionArgsSchema::getTableName();

    if ('expirationdate' === $query->get('orderby')) {
        $join .= " LEFT JOIN {$actionArgsSchemaTableName} ON {$actionArgsSchemaTableName}.post_id = {$wpdb->posts}.ID AND {$actionArgsSchemaTableName}.enabled = '1'";
    }

    return $join;
}

add_filter('posts_join', 'postexpirator_posts_join', 10, 2);

/**
 * Fills the 'Future Action' column of the post display table.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_show_value($column_name)
{
    if ($column_name !== 'expirationdate') {
        return;
    }

    global $post;

    // get the attributes that quick edit functionality requires
    // and save it as a JSON encoded HTML attribute
    $container = Container::getInstance();
    $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
    $postModel = $factory($post->ID);
    $settings = $container->get(ServicesAbstract::SETTINGS);

    PostExpirator_Display::getInstance()->render_template('expire-column', [
        'id' => $post->ID,
        'post_type' => $post->post_type,
        'attributes' => $postModel->getExpirationDataAsArray(),
        'column_style' => $settings->getColumnStyle(),
    ]);
}

add_action('manage_posts_custom_column', 'postexpirator_show_value');
add_action('manage_pages_custom_column', 'postexpirator_show_value');

/**
 * Returns the post types that are supported.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_get_post_types()
{
    $post_types = get_post_types(array('public' => true));
    $post_types = array_merge(
        $post_types,
        get_post_types(array(
            'public' => false,
            'show_ui' => true,
            '_builtin' => false
        ))
    );

    // in case some post types should not be supported.
    $unset_post_types = apply_filters('postexpirator_unset_post_types', array('attachment'));
    if ($unset_post_types) {
        foreach ($unset_post_types as $type) {
            unset($post_types[$type]);
        }
    }

    return $post_types;
}

function postexpirator_set_default_meta_for_post($postId, $post, $update)
{
    if ($update) {
        return;
    }

    $container = Container::getInstance();
    $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
    $defaultDataModel = $defaultDataModelFactory->create($post->post_type);

    if (! $defaultDataModel->isAutoEnabled()) {
        return;
    }

    $defaultExpire = $defaultDataModel->getActionDateParts();

    if (empty($defaultExpire['ts'])) {
        return;
    }

    $opts = [
        'expireType' => $defaultDataModel->getAction(),
        'category' => $defaultDataModel->getTerms(),
        'categoryTaxonomy' => (string)$defaultDataModel->getTaxonomy(),
    ];

    do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $defaultExpire['ts'], $opts);
}

/**
 * Register the shortcode.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_shortcode($attrs)
{
    global $post;

    $container = Container::getInstance();
    $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
    $postModel = $factory($post->ID);

    $enabled = $postModel->isExpirationEnabled();
    $expirationDateTs = $postModel->getExpirationDateAsUnixTime();
    if (! $enabled || empty($expirationDateTs)) {
        return false;
    }

    $attrs = shortcode_atts(
        array(
            'dateformat' => get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT),
            'timeformat' => get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT),
            'type' => 'full',
            'tz' => date('T'), // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
        ),
        $attrs
    );

    if (! isset($attrs['dateformat']) || empty($attrs['dateformat'])) {
        global $expirationdateDefaultDateFormat;
        $attrs['dateformat'] = $expirationdateDefaultDateFormat;
    }

    if (! isset($attrs['timeformat']) || empty($attrs['timeformat'])) {
        global $expirationdateDefaultTimeFormat;
        $attrs['timeformat'] = $expirationdateDefaultTimeFormat;
    }

    if (! isset($attrs['type']) || empty($attrs['type'])) {
        $attrs['type'] = 'full';
    }

    if (! isset($attrs['format']) || empty($attrs['format'])) {
        $attrs['format'] = $attrs['dateformat'] . ' ' . $attrs['timeformat'];
    }

    if ($attrs['type'] === 'full') {
        $attrs['format'] = $attrs['dateformat'] . ' ' . $attrs['timeformat'];
    } elseif ($attrs['type'] === 'date') {
        $attrs['format'] = $attrs['dateformat'];
    } elseif ($attrs['type'] === 'time') {
        $attrs['format'] = $attrs['timeformat'];
    }

    return PostExpirator_Util::get_wp_date($attrs['format'], $expirationDateTs);
}

/**
 * @deprecated 3.0.0 Use "futureaction" short instead
 */
add_shortcode('postexpirator', 'postexpirator_shortcode');
add_shortcode('futureaction', 'postexpirator_shortcode');

function postexpirator_get_footer_text($useDemoText =  false)
{
    if ($useDemoText) {
        $expirationDate = time() + 60 * 60 * 24 * 7;
    } else {
        global $post;

        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $expirationDate = $postModel->getExpirationDateAsUnixTime();
    }

    $dateformat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
    $timeformat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
    $expirationdateFooterContents = get_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);


    $search = [
        // Deprecated placeholders
        'EXPIRATIONFULL',
        'EXPIRATIONDATE',
        'EXPIRATIONTIME',
        // New placeholders
        'ACTIONFULL',
        'ACTIONDATE',
        'ACTIONTIME',
    ];

    $replace = [
        // Deprecated placeholders
        PostExpirator_Util::get_wp_date("$dateformat $timeformat", $expirationDate),
        PostExpirator_Util::get_wp_date($dateformat, $expirationDate),
        PostExpirator_Util::get_wp_date($timeformat, $expirationDate),
        // New placeholders
        PostExpirator_Util::get_wp_date("$dateformat $timeformat", $expirationDate),
        PostExpirator_Util::get_wp_date($dateformat, $expirationDate),
        PostExpirator_Util::get_wp_date($timeformat, $expirationDate)
    ];

    return str_replace(
        $search,
        $replace,
        $expirationdateFooterContents
    );
}

/**
 * Add the footer.
 *
 * @internal
 *
 * @access private
 */
function postexpirator_add_footer($text)
{
    global $post;

    // Check to see if its enabled
    $displayFooter = (bool) get_option('expirationdateDisplayFooter');

    // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
    if (! $displayFooter || empty($post)) {
        return $text;
    }

    $container = Container::getInstance();
    $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
    $postModel = $factory($post->ID);

    $enabled = $postModel->isExpirationEnabled();

    if (empty($enabled)) {
        return $text;
    }

    $expirationDate = $postModel->getExpirationDateAsUnixTime();
    if (! is_numeric($expirationDate)) {
        return $text;
    }

    $footerText = postexpirator_get_footer_text();

    $expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);

    $appendToFooter = '<p style="' . esc_attr($expirationdateFooterStyle) . '">' . esc_html($footerText) . '</p>';

    return $text . $appendToFooter;
}

add_action('the_content', 'postexpirator_add_footer', 0);


/**
 * Add Stylesheet
 *
 * @internal
 *
 * @access private
 */
function postexpirator_css($screen_id)
{
    switch ($screen_id) {
        case 'post.php':
        case 'post-new.php':
        case 'settings_page_post-expirator':
        case 'future_page_publishpress-future-scheduled-actions':
            wp_enqueue_style(
                'postexpirator-css',
                POSTEXPIRATOR_BASEURL . 'assets/css/style.css',
                false,
                POSTEXPIRATOR_VERSION
            );
            wp_enqueue_style(
                'pe-footer',
                POSTEXPIRATOR_BASEURL . 'assets/css/footer.css',
                false,
                POSTEXPIRATOR_VERSION
            );
            break;
        case 'edit.php':
            wp_enqueue_style(
                'postexpirator-edit',
                POSTEXPIRATOR_BASEURL . 'assets/css/edit.css',
                false,
                POSTEXPIRATOR_VERSION
            );
            break;
    }
}

add_action('admin_enqueue_scripts', 'postexpirator_css', 10, 1);

/**
 * PublishPress Future Activation/Upgrade
 *
 * @internal
 *
 * @access private
 */
function postexpirator_upgrade()
{
    $container = Container::getInstance();

    // Check for current version, if not exists, run activation
    $version = get_option('postexpiratorVersion');

    if ($version === false) {
        $container->get(ServicesAbstract::HOOKS)->doAction(V30000ActionArgsSchema::HOOK);
    } else {
        if (version_compare($version, '1.6.1') === -1) {
            update_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
        }

        if (version_compare($version, '2.0.0-rc1') === -1) {
            global $wpdb;

            // Schedule Events/Migrate Config
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
            $results = $wpdb->get_results(
                $wpdb->prepare(
                    'select post_id, meta_value from ' . $wpdb->postmeta . ' as postmeta, ' . $wpdb->posts . ' as posts where postmeta.post_id = posts.ID AND postmeta.meta_key = %s AND postmeta.meta_value >= %d',
                    'expiration-date',
                    time()
                )
            );

            foreach ($results as $result) {
                $opts = [];
                $posttype = get_post_type($result->post_id);
                if ($posttype === 'page') {
                    $opts['expireType'] = strtolower(get_option('expirationdateExpiredPageStatus', 'Draft'));
                } else {
                    $opts['expireType'] = strtolower(get_option('expirationdateExpiredPostStatus', 'Draft'));
                }

                $cat = get_post_meta($result->post_id, PostMetaAbstract::EXPIRATION_TERMS, true);
                if ((isset($cat) && ! empty($cat))) {
                    $opts['category'] = $cat;
                    $opts['expireType'] = 'category';
                }

                do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $result->post_id, $result->meta_value, $opts);
            }

            // update meta key to new format
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
            $wpdb->query(
                $wpdb->prepare(
                    "UPDATE $wpdb->postmeta SET meta_key = %s WHERE meta_key = %s",
                    PostMetaAbstract::EXPIRATION_TIMESTAMP,
                    'expiration-date'
                )
            );

            // migrate defaults
            $pagedefault = get_option('expirationdateExpiredPageStatus');
            $postdefault = get_option('expirationdateExpiredPostStatus');
            if ($pagedefault) {
                update_option('expirationdateDefaultsPage', array('expireType' => $pagedefault));
            }
            if ($postdefault) {
                update_option('expirationdateDefaultsPost', array('expireType' => $postdefault));
            }

            delete_option('expirationdateCronSchedule');
            delete_option('expirationdateAutoEnabled');
            delete_option('expirationdateExpiredPageStatus');
            delete_option('expirationdateExpiredPostStatus');
        }

        if (version_compare($version, '2.0.1') === -1) {
            // Forgot to do this in 2.0.0
            if (is_multisite()) {
                global $current_blog;
                wp_clear_scheduled_hook('expirationdate_delete_' . $current_blog->blog_id);
            } else {
                wp_clear_scheduled_hook('expirationdate_delete');
            }
        }

        if (version_compare($version, '3.0.0') === -1) {
            // TODO: DB migration should probably check a database version option and not the plugin version.
            $container->get(ServicesAbstract::HOOKS)->doAction(V30000ActionArgsSchema::HOOK);
            $container->get(ServicesAbstract::HOOKS)->doAction(V30000ReplaceFooterPlaceholders::HOOK);
            $container->get(ServicesAbstract::CRON)->enqueueAsyncAction(V30000WPCronToActionsScheduler::HOOK, [], true);
        }

        if (version_compare($version, '3.0.1') === -1) {
            if (! get_option('pp_future_V30001RestorePostMeta')) {
                $container->get(ServicesAbstract::CRON)->enqueueAsyncAction(V30001RestorePostMeta::HOOK, [], true);

                update_option('pp_future_V30001RestorePostMeta', true);
            }
        }
    }

    $currentVersion = $container->get(ServicesAbstract::PLUGIN_VERSION);
    if ($version !== $currentVersion) {
        update_option('postexpiratorVersion', $currentVersion);
    }
}

add_action('admin_init', 'postexpirator_upgrade', 99);


/**
 * The walker class for category checklist.
 *
 * @internal
 *
 * @access private
 */
class Walker_PostExpirator_Category_Checklist extends Walker
{

    /**
     * What the class handles.
     *
     * @var string
     */
    public $tree_type = 'category';

    /**
     * DB fields to use.
     *
     * @var array
     */
    public $db_fields = array('parent' => 'parent', 'id' => 'term_id'); // TODO: decouple this

    /**
     * The disabled attribute.
     *
     * @var string
     */
    public $disabled = '';

    /**
     * Set the disabled attribute.
     */
    public function setDisabled()
    {
        $this->disabled = 'disabled="disabled"';
    }

    /**
     * Starts the list before the elements are added.
     *
     * The $args parameter holds additional values that may be used with the child
     * class methods. This method is called at the start of the output list.
     *
     * @param string $output Used to append additional content (passed by reference).
     * @param int $depth Depth of the item.
     * @param array $args An array of additional arguments.
     */
    public function start_lvl(&$output, $depth = 0, $args = array())
    {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent<ul class='children'>\n";
    }

    /**
     * Ends the list of after the elements are added.
     *
     * The $args parameter holds additional values that may be used with the child
     * class methods. This method finishes the list at the end of output of the elements.
     *
     * @param string $output Used to append additional content (passed by reference).
     * @param int $depth Depth of the item.
     * @param array $args An array of additional arguments.
     */
    public function end_lvl(&$output, $depth = 0, $args = array())
    {
        $indent = str_repeat("\t", $depth);
        $output .= "$indent</ul>\n";
    }

    /**
     * Start the element output.
     *
     * The $args parameter holds additional values that may be used with the child
     * class methods. Includes the element output also.
     *
     * @param string $output Used to append additional content (passed by reference).
     * @param object $data_object The data object for category.
     * @param int $depth Depth of the item.
     * @param array $args An array of additional arguments.
     * @param int $current_object_id ID of the current item.
     */
    public function start_el(&$output, $data_object, $depth = 0, $args = array(), $current_object_id = 0)
    {
        $taxonomy = isset($args['taxonomy']) ? $args['taxonomy'] : 'category';
        $popular_cats = isset($args['popular_cats']) ? (array)$args['popular_cats'] : [];
        $selected_cats = isset($args['selected_cats']) ? (array)$args['selected_cats'] : [];

        $name = 'expirationdate_category';

        $class = in_array($data_object->term_id, $popular_cats, true) ? ' class="expirator-category"' : '';
        $output .= "\n<li id='expirator-{$taxonomy}-{$data_object->term_id}'$class>" . '<label class="selectit"><input value="' . $data_object->term_id . '" type="checkbox" name="' . $name . '[]" id="expirator-in-' . $taxonomy . '-' . $data_object->term_id . '"' . checked(
                in_array($data_object->term_id, $selected_cats, true),
                true,
                false
            ) . disabled(empty($args['disabled']), false, false) . ' ' . $this->disabled . '/> ' . esc_html(
                apply_filters('the_category', $data_object->name)
            ) . '</label>';
    }

    /**
     * Ends the element output, if needed.
     *
     * The $args parameter holds additional values that may be used with the child class methods.
     *
     * @param string $output Used to append additional content (passed by reference).
     * @param object $category The data object.
     * @param int $depth Depth of the item.
     * @param array $args An array of additional arguments.
     */
    public function end_el(&$output, $category, $depth = 0, $args = array())
    {
        $output .= "</li>\n";
    }
}
