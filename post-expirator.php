<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.7.8
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 */
$includeFilebRelativePath = '/publishpress/publishpress-instance-protection/include.php';
if (file_exists(__DIR__ . '/vendor' . $includeFilebRelativePath)) {
    require_once __DIR__ . '/vendor' . $includeFilebRelativePath;
} else if (defined('POSTEXPIRATOR_VENDOR_PATH') && file_exists(POSTEXPIRATOR_VENDOR_PATH . $includeFilebRelativePath)) {
    require_once POSTEXPIRATOR_VENDOR_PATH . $includeFilebRelativePath;
}

if (class_exists('PublishPressInstanceProtection\\Config')) {
    $pluginCheckerConfig = new PublishPressInstanceProtection\Config();
    $pluginCheckerConfig->pluginSlug = 'post-expirator';
    $pluginCheckerConfig->pluginName = 'PublishPress Future';

    $pluginChecker = new PublishPressInstanceProtection\InstanceChecker($pluginCheckerConfig);
}

if (! defined('POSTEXPIRATOR_LOADED')) {
    // Default Values
    define('POSTEXPIRATOR_VERSION', '2.7.8');
    define('POSTEXPIRATOR_DATEFORMAT', __('l F jS, Y', 'post-expirator'));
    define('POSTEXPIRATOR_TIMEFORMAT', __('g:ia', 'post-expirator'));
    define('POSTEXPIRATOR_FOOTERCONTENTS', __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'));
    define('POSTEXPIRATOR_FOOTERSTYLE', 'font-style: italic;');
    define('POSTEXPIRATOR_FOOTERDISPLAY', '0');
    define('POSTEXPIRATOR_EMAILNOTIFICATION', '0');
    define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', '0');
    define('POSTEXPIRATOR_DEBUGDEFAULT', '0');
    define('POSTEXPIRATOR_EXPIREDEFAULT', 'null');
    define('POSTEXPIRATOR_SLUG', 'post-expirator');
    define('POSTEXPIRATOR_BASEDIR', dirname(__FILE__));
    define('POSTEXPIRATOR_BASENAME', basename(__FILE__));
    define('POSTEXPIRATOR_BASEURL', plugins_url('/', __FILE__));
    define('POSTEXPIRATOR_LOADED', true);

    require_once POSTEXPIRATOR_BASEDIR . '/functions.php';

    $autoloadPath = POSTEXPIRATOR_BASEDIR . '/vendor/autoload.php';
    if (false === class_exists('PublishPressFuture\\DummyForAutoloadDetection')
        && true === file_exists($autoloadPath)
    ) {
        include_once $autoloadPath;
    }

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
     * Load translation, if it exists.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_init()
    {
        $plugin_dir = plugin_basename(__DIR__);
        load_plugin_textdomain('post-expirator', null, $plugin_dir . '/languages/');

        PostExpirator_Reviews::init();

        if (class_exists('WP_CLI')) {
            PostExpirator_Cli::getInstance();
        }

        add_action('wp_insert_post', 'postexpirator_set_default_meta_for_post', 10, 3);
    }

    add_action('plugins_loaded', 'postexpirator_init');

    /**
     * Adds an 'Expires' column to the post display table.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_add_column($columns, $type)
    {
        $defaults = get_option('expirationdateDefaults' . ucfirst($type));
        // if settings are not configured, show the metabox by default only for posts and pages
        if ((! isset($defaults['activeMetaBox']) && in_array($type, array(
                    'post',
                    'page'
                ), true)) || (is_array(
                    $defaults
                ) && $defaults['activeMetaBox'] === 'active')) {
            $columns['expirationdate'] = __('Expires', 'post-expirator');
        }

        return $columns;
    }

    add_filter('manage_posts_columns', 'postexpirator_add_column', 10, 2);

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
     * Adds an 'Expires' column to the post display table.
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
    function postexpirator_orderby($query)
    {
        if (! is_admin()) {
            return;
        }

        $orderby = $query->get('orderby');

        if ('expirationdate' === $orderby) {
            $query->set(
                'meta_query', array(
                    'relation' => 'OR',
                    array(
                        'key' => '_expiration-date',
                        'compare' => 'EXISTS',
                    ),
                    array(
                        'key' => '_expiration-date',
                        'compare' => 'NOT EXISTS',
                        'value' => '',
                    ),
                )
            );
            $query->set('orderby', 'meta_value_num');
        }
    }

    add_action('pre_get_posts', 'postexpirator_orderby');

    /**
     * Adds an 'Expires' column to the page display table.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_add_column_page($columns)
    {
        $defaults = get_option('expirationdateDefaultsPage');
        if (! isset($defaults['activeMetaBox']) || $defaults['activeMetaBox'] === 'active') {
            $columns['expirationdate'] = __('Expires', 'post-expirator');
        }

        return $columns;
    }

    add_filter('manage_pages_columns', 'postexpirator_add_column_page');

    /**
     * Fills the 'Expires' column of the post display table.
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
        $attributes = PostExpirator_Facade::get_expire_principles($post->ID);
        PostExpirator_Display::getInstance()->render_template('expire-column', array(
            'id' => $post->ID,
            'post_type' => $post->post_type,
            'attributes' => $attributes
        ));
    }

    add_action('manage_posts_custom_column', 'postexpirator_show_value');
    add_action('manage_pages_custom_column', 'postexpirator_show_value');


    /**
     * Quick Edit functionality.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_quickedit($column_name, $post_type)
    {
        if ($column_name !== 'expirationdate') {
            return;
        }

        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));
        $taxonomy = isset($defaults['taxonomy']) ? $defaults['taxonomy'] : '';
        $label = '';

        // if settings have not been configured and this is the default post type
        if (empty($taxonomy) && 'post' === $post_type) {
            $taxonomy = 'category';
        }

        if (! empty($taxonomy)) {
            $tax_object = get_taxonomy($taxonomy);
            $label = $tax_object ? $tax_object->label : '';
        }

        PostExpirator_Display::getInstance()->render_template('quick-edit', array(
            'post_type' => $post_type,
            'taxonomy' => $taxonomy,
            'tax_label' => $label
        ));
    }

    add_action('quick_edit_custom_box', 'postexpirator_quickedit', 10, 2);

    /**
     * Bulk Edit functionality.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_bulkedit($column_name, $post_type)
    {
        if ($column_name !== 'expirationdate') {
            return;
        }

        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));
        $taxonomy = isset($defaults['taxonomy']) ? $defaults['taxonomy'] : '';
        $label = '';

        // if settings have not been configured and this is the default post type
        if (empty($taxonomy) && 'post' === $post_type) {
            $taxonomy = 'category';
        }

        if (! empty($taxonomy)) {
            $tax_object = get_taxonomy($taxonomy);
            $label = $tax_object ? $tax_object->label : '';
        }

        PostExpirator_Display::getInstance()->render_template('bulk-edit', array(
            'post_type' => $post_type,
            'taxonomy' => $taxonomy,
            'tax_label' => $label
        ));
    }

    add_action('bulk_edit_custom_box', 'postexpirator_bulkedit', 10, 2);

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

    /**
     * Adds hooks to get the meta box added to pages and custom post types
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_meta_custom()
    {
        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $post_types = postexpirator_get_post_types();
        foreach ($post_types as $type) {
            $defaults = get_option('expirationdateDefaults' . ucfirst($type));
            // if settings are not configured, show the metabox by default only for posts and pages
            if ((! isset($defaults['activeMetaBox']) && in_array($type, array(
                        'post',
                        'page'
                    ), true)) || (is_array(
                        $defaults
                    ) && $defaults['activeMetaBox'] === 'active')) {
                add_meta_box(
                    'expirationdatediv',
                    __('PublishPress Future', 'post-expirator'),
                    'postexpirator_meta_box',
                    $type,
                    'side',
                    'core',
                    array('__back_compat_meta_box' => PostExpirator_Facade::show_gutenberg_metabox())
                );
            }
        }
    }

    add_action('add_meta_boxes', 'postexpirator_meta_custom');

    /**
     * Actually adds the meta box
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_meta_box($post)
    {
        $postMetaDate = get_post_meta($post->ID, '_expiration-date', true);
        $postMetaStatus = get_post_meta($post->ID, '_expiration-date-status', true);

        $expireType = $default = $enabled = '';
        $defaultsOption = get_option('expirationdateDefaults' . ucfirst($post->post_type));
        if (empty($postMetaDate)) {
            $defaultExpire = PostExpirator_Facade::get_default_expiry($post->post_type);

            $defaultMonth = $defaultExpire['month'];
            $defaultDay = $defaultExpire['day'];
            $defaultHour = $defaultExpire['hour'];
            $defaultYear = $defaultExpire['year'];
            $defaultMinute = $defaultExpire['minute'];

            $categories = get_option('expirationdateCategoryDefaults');

            if (isset($defaultsOption['expireType'])) {
                $expireType = $defaultsOption['expireType'];
            }
        } else {
            $defaultMonth = get_date_from_gmt(gmdate('Y-m-d H:i:s', $postMetaDate), 'm');
            $defaultDay = get_date_from_gmt(gmdate('Y-m-d H:i:s', $postMetaDate), 'd');
            $defaultYear = get_date_from_gmt(gmdate('Y-m-d H:i:s', $postMetaDate), 'Y');
            $defaultHour = get_date_from_gmt(gmdate('Y-m-d H:i:s', $postMetaDate), 'H');
            $defaultMinute = get_date_from_gmt(gmdate('Y-m-d H:i:s', $postMetaDate), 'i');

            $attributes = PostExpirator_Facade::get_expire_principles($post->ID);
            $expireType = $attributes['expireType'];
            $categories = $attributes['category'];
        }

        if (PostExpirator_Facade::is_expiration_enabled_for_post($post->ID)) {
            $enabled = ' checked="checked"';
        }

        PostExpirator_Display::getInstance()->render_template(
            'classic-metabox', [
                'post' => $post,
                'enabled' => $enabled,
                'default' => $default,
                'defaultsOption' => $defaultsOption,
                'defaultmonth' => $defaultMonth,
                'defaultday' => $defaultDay,
                'defaulthour' => $defaultHour,
                'defaultyear' => $defaultYear,
                'defaultminute' => $defaultMinute,
                'categories' => $categories,
                'expireType' => $expireType,
            ]
        );
    }

    function postexpirator_set_default_meta_for_post($postId, $post, $update)
    {
        if ($update) {
            return;
        }

        $postTypeDefaults = get_option('expirationdateDefaults' . ucfirst($post->post_type));

        if (empty($postTypeDefaults) || (int)$postTypeDefaults['autoEnable'] !== 1) {
            return;
        }

        $defaultExpire = PostExpirator_Facade::get_default_expiry($post->post_type);

        $categories = get_option('expirationdateCategoryDefaults');

        $status = ! empty($defaultExpire['ts']) ? 'saved' : '';

        $opts = [
            'expireType' => $postTypeDefaults['expireType'],
            'category' => $categories,
            'categoryTaxonomy' => (string)$postTypeDefaults['taxonomy'],
            'enabled' => $status === 'saved',
        ];

        update_post_meta($post->ID, '_expiration-date', $defaultExpire['ts']);
        update_post_meta($post->ID, '_expiration-date-status', $status);
        update_post_meta($post->ID, '_expiration-date-options', $opts);
        update_post_meta($post->ID, '_expiration-date-type', $postTypeDefaults['expireType']);
        update_post_meta($post->ID, '_expiration-date-categories', (array)$categories);
        update_post_meta($post->ID, '_expiration-date-taxonomy', $opts['categoryTaxonomy']);
    }

    /**
     * Add's ajax javascript.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_js_admin_header()
    {
        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }
        ?>
        <script type="text/javascript">
            //<![CDATA[
            (function ($) {
                $(document).ready(function () {
                    init();
                });

                function init() {
                    $('#enable-expirationdate').on('click', function (e) {
                        if ($(this).is(':checked')) {
                            $('.pe-classic-fields').show();
                        } else {
                            $('.pe-classic-fields').hide();
                        }
                    });

                    $('.pe-howtoexpire').on('change', function (e) {
                        if ($(this).val().indexOf('category') !== -1) {
                            $('#expired-category-selection').show();
                        } else {
                            $('#expired-category-selection').hide();
                        }
                    });
                }
            })(jQuery);
            //]]>
        </script>
        <?php
    }

    add_action('admin_head', 'postexpirator_js_admin_header');

    /**
     * Called when post is saved - stores expiration-date meta value
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_update_post_meta($id)
    {
        // don't run the echo if this is an auto save
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // don't run the echo if the function is called for saving revision.
        $posttype = get_post_type((int) $id);
        if ($posttype === 'revision') {
            return;
        }

        // Do not process Bulk edit here. It is processed on the function "postexpirator_date_save_bulk_edit"
        if (isset($_GET['postexpirator_view']) && $_GET['postexpirator_view'] === 'bulk-edit') {
            return;
        }

        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $postTypeDefaults = get_option('expirationdateDefaults' . ucfirst($posttype));

        $shouldSchedule = false;
        $ts = null;
        $opts = [];

        if (isset($_POST['postexpirator_view'])) {
            if (defined('DOING_AJAX') && DOING_AJAX) {
                check_ajax_referer('__postexpirator', '_postexpiratornonce');
            } else {
                check_admin_referer('__postexpirator', '_postexpiratornonce');
            }

            // Classic editor, quick edit
            $shouldSchedule = isset($_POST['enable-expirationdate']);

            $default = get_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
            if ($default === 'publish') {
                $month = intval($_POST['mm']);
                $day = intval($_POST['jj']);
                $year = intval($_POST['aa']);
                $hour = intval($_POST['hh']);
                $minute = intval($_POST['mn']);
            } else {
                $month = intval($_POST['expirationdate_month']);
                $day = intval($_POST['expirationdate_day']);
                $year = intval($_POST['expirationdate_year']);
                $hour = intval($_POST['expirationdate_hour']);
                $minute = intval($_POST['expirationdate_minute']);

                if (empty($day)) {
                    $day = date('d');
                }
                if (empty($year)) {
                    $year = date('Y');
                }
            }
            $category = isset($_POST['expirationdate_category'])
                ? PostExpirator_Util::sanitize_array_of_integers($_POST['expirationdate_category']) : []; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

            $ts = get_gmt_from_date("$year-$month-$day $hour:$minute:0", 'U');

            if (isset($_POST['expirationdate_quickedit'])) {
                $opts = PostExpirator_Facade::get_expire_principles($id);
                if (isset($_POST['expirationdate_expiretype'])) {
                    $opts['expireType'] = sanitize_key($_POST['expirationdate_expiretype']);
                    if (in_array($opts['expireType'], array(
                        'category',
                        'category-add',
                        'category-remove'
                    ), true)) {
                        $opts['category'] = $category;
                        $opts['categoryTaxonomy'] = $postTypeDefaults['taxonomy'];
                    }
                }
            } else {
                // Schedule/Update Expiration
                $opts['expireType'] = sanitize_key($_POST['expirationdate_expiretype']);
                $opts['id'] = $id;

                if ($opts['expireType'] === 'category' || $opts['expireType'] === 'category-add' || $opts['expireType'] === 'category-remove') {
                    if (isset($category) && ! empty($category)) {
                        $opts['category'] = $category;
                        $opts['categoryTaxonomy'] = $postTypeDefaults['taxonomy'];
                    }
                }
            }
        } else {
            // Gutenberg or script request
            $payload = @file_get_contents('php://input');

            if (empty($payload)) {
                $debug = postexpirator_debug();

                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array(
                            'message' => $id . ' -> NO PAYLOAD ON SAVE_POST'
                        )
                    );
                }

                return;
            }

            $payload = @json_decode($payload, true);

            if (isset($payload['meta'])) {
                if (isset($payload['meta']['_expiration-date-status'])) {
                    $shouldSchedule = $payload['meta']['_expiration-date-status'] === 'saved'
                        && isset($payload['meta']['_expiration-date'])
                        && false === empty($payload['meta']['_expiration-date']);
                } else {
                    $shouldSchedule = PostExpirator_Facade::is_expiration_enabled_for_post($id);
                }

                if ($shouldSchedule) {
                    if (isset($payload['meta']['_expiration-date'])) {
                        $ts = sanitize_text_field($payload['meta']['_expiration-date']);
                    } else {
                        $ts = get_post_meta($id, '_expiration-date', true);
                    }

                    if (isset($payload['meta']['_expiration-date-type'])) {
                        $opts['expireType'] = sanitize_key($payload['meta']['_expiration-date-type']);
                    } else {
                        $opts['expireType'] = get_post_meta($id, '_expiration-date-type', true);
                    }

                    if (isset($payload['meta']['_expiration-date-categories'])) {
                        $opts['category'] = PostExpirator_Util::sanitize_array_of_integers($payload['meta']['_expiration-date-categories']);
                    } else {
                        $opts['category'] = (array)get_post_meta($id, '_expiration-date-categories', true);
                    }

                    $opts['categoryTaxonomy'] = $postTypeDefaults['taxonomy'];
                }
            } else {
                $shouldSchedule = PostExpirator_Facade::is_expiration_enabled_for_post($id);

                if ($shouldSchedule) {
                    $ts = get_post_meta($id, '_expiration-date', true);

                    $opts['expireType'] = get_post_meta($id, '_expiration-date-type', true);
                    $opts['category'] = (array)get_post_meta($id, '_expiration-date-categories', true);
                    $opts['categoryTaxonomy'] = $postTypeDefaults['taxonomy'];
                }
            }
        }

        if ($shouldSchedule) {
            $opts['id'] = $id;
            postexpirator_schedule_event($id, $ts, $opts);
        } else {
            postexpirator_unschedule_event($id);
        }
    }

    add_action('save_post', 'postexpirator_update_post_meta');

    /**
     * Schedules the single event.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_schedule_event($id, $ts, $opts)
    {
        $debug = postexpirator_debug(); // check for/load debug

        $id = intval($id);

        do_action('postexpirator_schedule', $id, $ts, $opts); // allow custom actions

        if (wp_next_scheduled('postExpiratorExpire', array($id)) !== false) {
            $error = wp_clear_scheduled_hook('postExpiratorExpire', array($id), true); // Remove any existing hooks
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(
                    array(
                        'message' => $id . ' -> EXISTING CRON EVENT FOUND - UNSCHEDULED - ' . (is_wp_error(
                                $error
                            ) ? $error->get_error_message() : 'no error')
                    )
                );
            }
        }

        $scheduled = wp_schedule_single_event($ts, 'postExpiratorExpire', array($id), true);
        if (POSTEXPIRATOR_DEBUG) {
            if ($scheduled) {
                $debug->save(
                    array(
                        'message' => $id . ' -> CRON EVENT SCHEDULED at ' .
                            PostExpirator_Util::get_wp_date('r', $ts)
                            . ' ' . '(' . $ts . ') with options ' . print_r($opts, true) . ' no error'
                    )
                );
            } else {
                $debug->save(
                    array(
                        'message' => $id . ' -> TRIED TO SCHEDULE CRON EVENT at ' .
                            PostExpirator_Util::get_wp_date('r', $ts)
                            . ' ' . '(' . $ts . ') with options ' . print_r($opts, true) . ' ' . (is_wp_error(
                                $scheduled
                            ) ? $scheduled->get_error_message() : 'no error')
                    )
                );
            }
        }

        // Update Post Meta
        update_post_meta($id, '_expiration-date', $ts);
        if (! is_null($opts)) {
            PostExpirator_Facade::set_expire_principles($id, $opts);
        }
        update_post_meta($id, '_expiration-date-status', 'saved');
    }

    /**
     * Unschedules the single event.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_unschedule_event($id)
    {
        $debug = postexpirator_debug(); // check for/load debug

        do_action('postexpirator_unschedule', $id); // allow custom actions

        delete_post_meta($id, '_expiration-date');
        delete_post_meta($id, '_expiration-date-options');
        delete_post_meta($id, '_expiration-date-type');
        delete_post_meta($id, '_expiration-date-categories');
        delete_post_meta($id, '_expiration-date-taxonomy');

        // Delete Scheduled Expiration
        if (wp_next_scheduled('postExpiratorExpire', array($id)) !== false) {
            wp_clear_scheduled_hook('postExpiratorExpire', array($id)); // Remove any existing hooks
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(array('message' => $id . ' -> UNSCHEDULED'));
            }
        }
        delete_post_meta($id, '_expiration-date-status');
    }

    /**
     * The new expiration function, to work with single scheduled events.
     *
     * This was designed to hopefully be more flexible for future tweaks/modifications to the architecture.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_expire_post($id)
    {
        $debug = postexpirator_debug(); // check for/load debug

        $id = (int)$id;

        if (POSTEXPIRATOR_DEBUG) {
            $debug->save(array('message' => 'Called postexpirator_expire_post with id=' . $id));
        }

        if (empty($id)) {
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(array('message' => 'No Post ID found - exiting'));
            }

            return false;
        }

        $post = get_post($id);

        if (is_null($post)) {
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(array('message' => $id . ' -> Post does not exist - exiting'));
            }

            return false;
        }

        $postExpireOptions = PostExpirator_Facade::get_expire_principles($id);

        if ($postExpireOptions['enabled'] === false) {
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(array('message' => $id . ' -> Post expire data exist but is not activated'));
            }

            return false;
        }

        $postType = get_post_type($id);
        $postTitle = get_the_title($id);
        $postLink = get_post_permalink($id);

        $expireType = $expireCategory = $expireCategoryTaxonomy = null;

        if (isset($postExpireOptions['expireType'])) {
            $expireType = $postExpireOptions['expireType'];
        }

        if (isset($postExpireOptions['category'])) {
            $expireCategory = $postExpireOptions['category'];
        }

        if (isset($postExpireOptions['categoryTaxonomy'])) {
            $expireCategoryTaxonomy = $postExpireOptions['categoryTaxonomy'];
        }

        $expirationDate = (int)get_post_meta($id, '_expiration-date', true);

        if (empty($expirationDate)) {
            if (POSTEXPIRATOR_DEBUG) {
                $debug->save(array('message' => $id . ' -> Tried to expire the post but the expire date is empty'));
            }

            return false;
        }

        // Check for default expire only if not passed in
        if (empty($expireType)) {
            $postType = get_post_type($id);
            if ($postType === 'page') {
                $expireType = strtolower(get_option('expirationdateExpiredPageStatus', POSTEXPIRATOR_PAGESTATUS));
            } elseif ($postType === 'post') {
                $expireType = strtolower(get_option('expirationdateExpiredPostStatus', 'draft'));
            } else {
                $expireType = apply_filters(
                    'postexpirator_custom_posttype_expire',
                    $expireType,
                    $postType
                ); // hook to set defaults for custom post types
            }
        }

        // Remove KSES - wp_cron runs as an unauthenticated user, which will by default trigger kses filtering,
        // even if the post was published by a admin user.  It is fairly safe here to remove the filter call since
        // we are only changing the post status/meta information and not touching the content.
        kses_remove_filters();

        $postWasExpired = false;
        $expirationLog = [
            'type' => sanitize_text_field($expireType),
            'scheduled_for' => date('Y-m-d H:i:s', $expirationDate)
        ];

        // Do Work
        if ($expireType === 'draft') {
            // TODO: fix this, because wp_update_post returns int or WP_ERROR, not 0. Check other places doing the same.
            if (wp_update_post(array('ID' => $id, 'post_status' => 'draft')) === 0) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __(
                        '%1$s (%2$s) has expired at %3$s. Post status has been successfully changed to "%4$s".',
                        'post-expirator'
                    ),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    strtoupper($expireType)
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                wp_transition_post_status('draft', $post->post_status, $post);

                $postWasExpired = true;
            }
        } elseif ($expireType === 'private') {
            if (wp_update_post(array('ID' => $id, 'post_status' => 'private')) === 0) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __(
                        '%1$s (%2$s) has expired at %3$s. Post status has been successfully changed to "%4$s".',
                        'post-expirator'
                    ),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    strtoupper($expireType)
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                wp_transition_post_status('private', $post->post_status, $post);

                $postWasExpired = true;
            }
        } elseif ($expireType === 'delete') {
            if (wp_delete_post($id) === false) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __(
                        '%1$s (%2$s) has expired at %3$s. Post status has been successfully changed to "%4$s".',
                        'post-expirator'
                    ),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    strtoupper($expireType)
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                $postWasExpired = true;
            }
        } elseif ($expireType === 'trash') {
            if (wp_trash_post($id) === false) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __(
                        '%1$s (%2$s) has expired at %3$s. Post status has been successfully changed to "%4$s".',
                        'post-expirator'
                    ),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    strtoupper($expireType)
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                $postWasExpired = true;
            }
        } elseif ($expireType === 'stick') {
            if (stick_post($id) === false) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __('%1$s (%2$s) has expired at %3$s. Post "%4$s" status has been successfully set.', 'post-expirator'),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    'STICKY'
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                $postWasExpired = true;
            }
        } elseif ($expireType === 'unstick') {
            if (unstick_post($id) === false) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true)));
                }
            } else {
                $emailBody = sprintf(
                    __(
                        '%1$s (%2$s) has expired at %3$s. Post "%4$s" status has been successfully removed.',
                        'post-expirator'
                    ),
                    '##POSTTITLE##',
                    '##POSTLINK##',
                    '##EXPIRATIONDATE##',
                    'STICKY'
                );
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                    );
                }

                $postWasExpired = true;
            }
        } elseif ($expireType === 'category') {
            if (! empty($expireCategory)) {
                if (empty($expireCategoryTaxonomy) || $expireCategoryTaxonomy === 'category') {
                    $expirationLog['taxonomy'] = 'category';

                    if (wp_update_post(array('ID' => $id, 'post_category' => $expireCategory)) === 0) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. Post "%4$s" have now been set to "%5$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES REPLACED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                } else {
                    $terms = PostExpirator_Util::sanitize_array_of_integers($expireCategory);

                    $expirationLog['taxonomy'] = $expireCategoryTaxonomy;
                    $expirationLog['terms'] = $terms;

                    if (is_wp_error(wp_set_object_terms($id, $terms, $expireCategoryTaxonomy, false))) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        // TODO: Use the sanitized variable instead
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. Post "%4$s" have now been set to "%5$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES REPLACED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                }
            } else {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array(
                            'message' => $id . ' -> CATEGORIES MISSING ' . $expireType . ' ' . print_r(
                                    $postExpireOptions,
                                    true
                                )
                        )
                    );
                }
            }
        } elseif ($expireType === 'category-add') {
            if (! empty($expireCategory)) {
                if (empty($expireCategoryTaxonomy) || $expireCategoryTaxonomy === 'category') {
                    $expirationLog['taxonomy'] = 'category';
                    $expirationLog['terms'] = $expireCategory;

                    $postCategories = wp_get_post_categories($id);
                    $mergedCategories = array_merge($postCategories, $expireCategory);
                    if (wp_update_post(array('ID' => $id, 'post_category' => $mergedCategories)) === 0) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. The following post "%4$s" have now been added: "%5$s". The full list of categories on the post are: "%6$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory)),
                            implode(',', _postexpirator_get_cat_names($mergedCategories))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES ADDED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($mergedCategories),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                } else {
                    $terms = PostExpirator_Util::sanitize_array_of_integers($expireCategory);

                    ray($terms, $expireCategory, $expireCategoryTaxonomy);

                    $expirationLog['taxonomy'] = $expireCategoryTaxonomy;
                    $expirationLog['terms'] = $terms;

                    if (is_wp_error(wp_set_object_terms($id, $terms, $expireCategoryTaxonomy, true))) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. The following post "%4$s" have now been added: "%5$s". The full list of categories on the post are: "%6$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory)),
                            implode(',', _postexpirator_get_cat_names($terms))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES ADDED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                }
            } else {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array(
                            'message' => $id . ' -> CATEGORIES MISSING ' . $expireType . ' ' . print_r(
                                    $postExpireOptions,
                                    true
                                )
                        )
                    );
                }
            }
        } elseif ($expireType === 'category-remove') {
            if (! empty($expireCategory)) {
                if (empty($expireCategoryTaxonomy) || $expireCategoryTaxonomy === 'category') {
                    $expirationLog['taxonomy'] = 'category';
                    $expirationLog['terms'] = $expireCategory;

                    $postCategories = wp_get_post_categories($id);
                    $mergedCategories = array();
                    foreach ($postCategories as $category) {
                        if (! in_array($category, $expireCategory, false)) {
                            $mergedCategories[] = $category;
                        }
                    }

                    if (wp_update_post(array('ID' => $id, 'post_category' => $mergedCategories)) === 0) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. The following post "%4$s" have now been removed: "%5$s". The full list of categories on the post are: "%6$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory)),
                            implode(',', _postexpirator_get_cat_names($mergedCategories))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES REMOVED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($mergedCategories),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                } else {
                    $terms = wp_get_object_terms($id, $expireCategoryTaxonomy, array('fields' => 'ids'));

                    $expirationLog['taxonomy'] = $expireCategoryTaxonomy;
                    $expirationLog['terms'] = $terms;

                    $mergedCategories = array();
                    foreach ($terms as $term) {
                        if (! in_array($term, $expireCategory, false)) {
                            $mergedCategories[] = $term;
                        }
                    }
                    $terms = PostExpirator_Util::sanitize_array_of_integers($mergedCategories);
                    if (is_wp_error(wp_set_object_terms($id, $terms, $expireCategoryTaxonomy, false))) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> FAILED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                        }
                    } else {
                        $emailBody = sprintf(
                            __(
                                '%1$s (%2$s) has expired at %3$s. The following post "%4$s" have now been removed: "%5$s". The full list of categories on the post are: "%6$s".',
                                'post-expirator'
                            ),
                            '##POSTTITLE##',
                            '##POSTLINK##',
                            '##EXPIRATIONDATE##',
                            'CATEGORIES',
                            implode(',', _postexpirator_get_cat_names($expireCategory)),
                            implode(',', _postexpirator_get_cat_names($mergedCategories))
                        );
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(
                                array('message' => $id . ' -> PROCESSED ' . $expireType . ' ' . print_r($postExpireOptions, true))
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES REMOVED ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                            $debug->save(
                                array(
                                    'message' => $id . ' -> CATEGORIES COMPLETE ' . print_r(
                                            _postexpirator_get_cat_names($expireCategory),
                                            true
                                        )
                                )
                            );
                        }

                        $postWasExpired = true;
                    }
                }
            } else {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(
                        array(
                            'message' => $id . ' -> CATEGORIES MISSING ' . $expireType . ' ' . print_r(
                                    $postExpireOptions,
                                    true
                                )
                        )
                    );
                }
            }
        }

        // Process Email
        $emailEnabled = get_option('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);

        $expirationLog['email_enabled'] = (bool) $emailEnabled;

        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if ($emailEnabled == 1 && isset($emailBody)) {
            $emailSubject = sprintf(__('Post Expiration Complete "%s"', 'post-expirator'), $postTitle);
            $emailBody = str_replace('##POSTTITLE##', $postTitle, $emailBody);
            $emailBody = str_replace('##POSTLINK##', $postLink, $emailBody);
            $emailBody = str_replace(
                '##EXPIRATIONDATE##',
                get_date_from_gmt(
                    gmdate('Y-m-d H:i:s', $expirationDate),
                    get_option('date_format') . ' ' . get_option('time_format')
                ),
                $emailBody
            );

            $emailsToSend = array();

            // Get Blog Admins
            $blogAdmins = get_option('expirationdateEmailNotificationAdmins', POSTEXPIRATOR_EMAILNOTIFICATIONADMINS);
            // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
            if ($blogAdmins == 1) {
                $blogUsers = get_users('role=Administrator');
                foreach ($blogUsers as $user) {
                    $emailsToSend[] = $user->user_email;
                }
            }

            // Get Global Notification Emails
            $emailsList = get_option('expirationdateEmailNotificationList');
            if (! empty($emailsList)) {
                $values = explode(',', $emailsList);
                foreach ($values as $value) {
                    $emailsToSend[] = trim($value);
                }
            }

            // Get Post Type Notification Emails
            $defaults = get_option('expirationdateDefaults' . ucfirst($postType));
            if (isset($defaults['emailnotification']) && ! empty($defaults['emailnotification'])) {
                $values = explode(',', $defaults['emailnotification']);
                foreach ($values as $value) {
                    $emailsToSend[] = trim($value);
                }
            }

            $emailsToSend = array_unique($emailsToSend);

            if (! empty($emailsToSend)) {
                if (POSTEXPIRATOR_DEBUG) {
                    $debug->save(array('message' => $id . ' -> SENDING EMAIL TO (' . implode(', ', $emailsToSend) . ')'));
                }

                // Send Emails
                foreach ($emailsToSend as $email) {
                    if (wp_mail($email, sprintf(__('[%1$s] %2$s'), get_option('blogname'), $emailSubject), $emailBody)) {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(array('message' => $id . ' -> EXPIRATION EMAIL SENT (' . $email . ')'));
                        }

                        $expirationLog['email_sent'] = true;
                    } else {
                        if (POSTEXPIRATOR_DEBUG) {
                            $debug->save(array('message' => $id . ' -> EXPIRATION EMAIL FAILED (' . $email . ')'));
                        }

                        $expirationLog['email_sent'] = false;
                    }
                }
            }
        }

        if (true === $postWasExpired) {
            postexpirator_register_expiration_meta($id, $expirationLog);
            postexpirator_unschedule_event($id);
        }
    }

    add_action('postExpiratorExpire', 'postexpirator_expire_post');

    function postexpirator_register_expiration_meta($id, $log)
    {
        $log['expired_on'] = date('Y-m-d H:i:s');

        add_post_meta($id, 'expiration_log', wp_json_encode($log));
    }

    /**
     * Internal method to get category names corresponding to the category IDs.
     *
     * @internal
     *
     * @access private
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
     * Show the menu.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_menu()
    {
        _deprecated_function(__FUNCTION__, '2.5');
    }

    /**
     * Hook's to add plugin page menu
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_add_menu()
    {
        _deprecated_function(__FUNCTION__, '2.5');
    }

    /**
     * Show the Expiration Date options page
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_menu_general()
    {
        _deprecated_function(__FUNCTION__, '2.5');
        PostExpirator_Display::getInstance()->load_tab('general');
    }

    /**
     * The default menu.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_menu_defaults()
    {
        _deprecated_function(__FUNCTION__, '2.5');
        PostExpirator_Display::getInstance()->load_tab('defaults');
    }

    /**
     * Diagnostics menu.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_menu_diagnostics()
    {
        _deprecated_function(__FUNCTION__, '2.5');
        PostExpirator_Display::getInstance()->load_tab('diagnostics');
    }

    /**
     * Debug menu.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_menu_debug()
    {
        _deprecated_function(__FUNCTION__, '2.5');
        PostExpirator_Display::getInstance()->load_tab('viewdebug');
    }

    /**
     * Register the shortcode.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_shortcode($atts)
    {
        global $post;

        $enabled = PostExpirator_Facade::is_expiration_enabled_for_post($post->ID);
        $expirationdatets = get_post_meta($post->ID, '_expiration-date', true);
        if (! $enabled || empty($expirationdatets)) {
            return false;
        }

        // @TODO remove extract
        // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
        extract(
            shortcode_atts(
                array(
                    'dateformat' => get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT),
                    'timeformat' => get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT),
                    'type' => 'full',
                    'tz' => date('T'),
                ),
                $atts
            )
        );

        if (empty($dateformat)) {
            global $expirationdateDefaultDateFormat;
            $dateformat = $expirationdateDefaultDateFormat;
        }

        if (empty($timeformat)) {
            global $expirationdateDefaultTimeFormat;
            $timeformat = $expirationdateDefaultTimeFormat;
        }

        if ($type === 'full') {
            $format = $dateformat . ' ' . $timeformat;
        } elseif ($type === 'date') {
            $format = $dateformat;
        } elseif ($type === 'time') {
            $format = $timeformat;
        }

        return PostExpirator_Util::get_wp_date($format, $expirationdatets);
    }

    add_shortcode('postexpirator', 'postexpirator_shortcode');

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
        $displayFooter = get_option('expirationdateDisplayFooter');

        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if ($displayFooter === false || $displayFooter == 0) {
            return $text;
        }

        $enabled = PostExpirator_Facade::is_expiration_enabled_for_post($post->ID);

        if (empty($enabled)) {
            return $text;
        }

        $expirationdatets = get_post_meta($post->ID, '_expiration-date', true);
        if (! is_numeric($expirationdatets)) {
            return $text;
        }

        $dateformat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
        $timeformat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
        $expirationdateFooterContents = get_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);
        $expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);

        $search = array(
            'EXPIRATIONFULL',
            'EXPIRATIONDATE',
            'EXPIRATIONTIME',
        );

        $replace = array(
            PostExpirator_Util::get_wp_date("$dateformat $timeformat", $expirationdatets),
            PostExpirator_Util::get_wp_date($dateformat, $expirationdatets),
            PostExpirator_Util::get_wp_date($timeformat, $expirationdatets)
        );

        $add_to_footer = '<p style="' . $expirationdateFooterStyle . '">' . str_replace(
                $search,
                $replace,
                $expirationdateFooterContents
            ) . '</p>';

        return $text . $add_to_footer;
    }

    add_action('the_content', 'postexpirator_add_footer', 0);

    /**
     * Check for Debug
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_debug()
    {
        $debug = get_option('expirationdateDebug');
        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if ($debug == 1) {
            if (! defined('POSTEXPIRATOR_DEBUG')) {
                define('POSTEXPIRATOR_DEBUG', 1);
            }
            require_once(POSTEXPIRATOR_BASEDIR . '/post-expirator-debug.php'); // Load Class

            return new PostExpiratorDebug();
        } else {
            if (! defined('POSTEXPIRATOR_DEBUG')) {
                define('POSTEXPIRATOR_DEBUG', 0);
            }

            return false;
        }
    }


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
                wp_enqueue_style(
                    'postexpirator-css',
                    POSTEXPIRATOR_BASEURL . '/assets/css/style.css',
                    array(),
                    POSTEXPIRATOR_VERSION
                );
                break;
            case 'edit.php':
                wp_enqueue_style(
                    'postexpirator-edit',
                    POSTEXPIRATOR_BASEURL . '/assets/css/edit.css',
                    array(),
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
        // Check for current version, if not exists, run activation
        $version = get_option('postexpiratorVersion');
        if ($version === false) { // not installed, run default activation
            postexpirator_activate();
            update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
        } else {
            if (version_compare($version, '1.6.1') === -1) {
                update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
                update_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
            }

            if (version_compare($version, '1.6.2') === -1) {
                update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
            }

            if (version_compare($version, '2.0.0-rc1') === -1) {
                global $wpdb;

                // Schedule Events/Migrate Config
                $results = $wpdb->get_results(
                    $wpdb->prepare(
                        'select post_id, meta_value from ' . $wpdb->postmeta . ' as postmeta, ' . $wpdb->posts . ' as posts where postmeta.post_id = posts.ID AND postmeta.meta_key = %s AND postmeta.meta_value >= %d',
                        'expiration-date',
                        time()
                    )
                );
                foreach ($results as $result) {
                    wp_schedule_single_event($result->meta_value, 'postExpiratorExpire', array($result->post_id));
                    $opts = array();
                    $opts['id'] = $result->post_id;
                    $posttype = get_post_type($result->post_id);
                    if ($posttype === 'page') {
                        $opts['expireType'] = strtolower(get_option('expirationdateExpiredPageStatus', 'Draft'));
                    } else {
                        $opts['expireType'] = strtolower(get_option('expirationdateExpiredPostStatus', 'Draft'));
                    }

                    $cat = get_post_meta($result->post_id, '_expiration-date-category', true);
                    if ((isset($cat) && ! empty($cat))) {
                        $opts['category'] = $cat;
                        $opts['expireType'] = 'category';
                    }

                    PostExpirator_Facade::set_expire_principles($result->post_id, $opts);
                }

                // update meta key to new format
                $wpdb->query(
                    $wpdb->prepare(
                        "UPDATE $wpdb->postmeta SET meta_key = %s WHERE meta_key = %s",
                        '_expiration-date',
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
                update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
            }

            if (version_compare($version, '2.0.1') === -1) {
                // Forgot to do this in 2.0.0
                if (is_multisite()) {
                    global $current_blog;
                    wp_clear_scheduled_hook('expirationdate_delete_' . $current_blog->blog_id);
                } else {
                    wp_clear_scheduled_hook('expirationdate_delete');
                }

                update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
            }

            update_option('postexpiratorVersion', POSTEXPIRATOR_VERSION);
        }
    }

    add_action('admin_init', 'postexpirator_upgrade');

    /**
     * Called at plugin activation
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_activate()
    {
        if (get_option('expirationdateDefaultDateFormat') === false) {
            update_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
        }
        if (get_option('expirationdateDefaultTimeFormat') === false) {
            update_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
        }
        if (get_option('expirationdateFooterContents') === false) {
            update_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);
        }
        if (get_option('expirationdateFooterStyle') === false) {
            update_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);
        }
        if (get_option('expirationdateDisplayFooter') === false) {
            update_option('expirationdateDisplayFooter', POSTEXPIRATOR_FOOTERDISPLAY);
        }
        if (get_option('expirationdateDebug') === false) {
            update_option('expirationdateDebug', POSTEXPIRATOR_DEBUGDEFAULT);
        }
        if (get_option('expirationdateDefaultDate') === false) {
            update_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
        }
        if (get_option('expirationdateGutenbergSupport') === false) {
            update_option('expirationdateGutenbergSupport', 1);
        }
    }

    /**
     * Called at plugin deactivation
     *
     * @internal
     *
     * @access private
     */
    function expirationdate_deactivate()
    {
        $preserveData = (bool)get_option('expirationdatePreserveData', true);

        if ($preserveData) {
            return;
        }

        delete_option('expirationdateExpiredPostStatus');
        delete_option('expirationdateExpiredPageStatus');
        delete_option('expirationdateDefaultDateFormat');
        delete_option('expirationdateDefaultTimeFormat');
        delete_option('expirationdateDisplayFooter');
        delete_option('expirationdateFooterContents');
        delete_option('expirationdateFooterStyle');
        delete_option('expirationdateCategory');
        delete_option('expirationdateCategoryDefaults');
        delete_option('expirationdateDebug');
        delete_option('postexpiratorVersion');
        delete_option('expirationdateCronSchedule');
        delete_option('expirationdateDefaultDate');
        delete_option('expirationdateDefaultDateCustom');
        delete_option('expirationdateAutoEnabled');
        delete_option('expirationdateDefaultsPage');
        delete_option('expirationdateDefaultsPost');
        delete_option('expirationdateGutenbergSupport');
        delete_option('expirationdatePreserveData');

        // what about custom post types? - how to clean up?
        if (is_multisite()) {
            global $current_blog;

            wp_clear_scheduled_hook('expirationdate_delete_' . $current_blog->blog_id);
        } else {
            wp_clear_scheduled_hook('expirationdate_delete');
        }
        require_once(POSTEXPIRATOR_BASEDIR . '/post-expirator-debug.php');
        $debug = new PostExpiratorDebug();
        $debug->removeDbTable();
    }

    register_deactivation_hook(__FILE__, 'expirationdate_deactivate');

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
         * @param object $category The data object.
         * @param int $depth Depth of the item.
         * @param array $args An array of additional arguments.
         * @param int $current_object_id ID of the current item.
         */
        public function start_el(&$output, $category, $depth = 0, $args = array(), $current_object_id = 0)
        {
            // @TODO remove extract
            // phpcs:ignore WordPress.PHP.DontExtract.extract_extract
            extract($args);
            if (empty($taxonomy)) {
                $taxonomy = 'category';
            }

            $name = 'expirationdate_category';

            $class = in_array($category->term_id, $popular_cats, true) ? ' class="expirator-category"' : '';
            $output .= "\n<li id='expirator-{$taxonomy}-{$category->term_id}'$class>" . '<label class="selectit"><input value="' . $category->term_id . '" type="checkbox" name="' . $name . '[]" id="expirator-in-' . $taxonomy . '-' . $category->term_id . '"' . checked(
                    in_array($category->term_id, $selected_cats, true),
                    true,
                    false
                ) . disabled(empty($args['disabled']), false, false) . ' ' . $this->disabled . '/> ' . esc_html(
                    apply_filters('the_category', $category->name)
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

    /**
     * Get the HTML for expire type.
     *
     * @internal
     *
     * @access private
     */
    function _postexpirator_expire_type($opts)
    {
        if (empty($opts)) {
            return false;
        }

        PostExpirator_Display::getInstance()->render_template('how-to-expire', array('opts' => $opts));
    }

    /**
     * Get the HTML for taxonomy.
     *
     * @internal
     *
     * @access private
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

        $output = [];

        $output[] = '<select name="' . esc_attr($name) . '" id="' . esc_attr($id) . '"' . ($disabled === true ? ' disabled="disabled"' : '') . ' onchange="' . esc_attr($onchange) . '">';

        foreach ($taxonomies as $taxonomy) {
            $output[] = '<option value="' . esc_attr($taxonomy->name) . '" ' . ($selected === esc_attr($taxonomy->name) ? 'selected="selected"' : '') . '>' . esc_html($taxonomy->label) . '</option>';
        }

        $output[] = '</select>';
        $output[] = '<p class="description">' . esc_html__(
                'Select the hierarchical taxonomy to be used for "category" based expiration.',
                'post-expirator'
            ) . '</p>';

        return implode("<br/>\n", $output);
    }

    /**
     * Include the JS.
     *
     * @internal
     *
     * @access private
     */
    function postexpirator_quickedit_javascript()
    {
        // if using code as plugin
        wp_enqueue_script('postexpirator-edit', POSTEXPIRATOR_BASEURL . '/assets/js/admin-edit.js', array(
            'jquery',
            'inline-edit-post'
        ), POSTEXPIRATOR_VERSION, true);

        global $wp_version;

        wp_localize_script(
            'postexpirator-edit', 'postexpiratorConfig', array(
                'wpAfter6' => version_compare($wp_version, '6', '>='),
                'ajax' => array(
                    'nonce' => wp_create_nonce(POSTEXPIRATOR_SLUG),
                    'bulk_edit' => 'manage_wp_posts_using_bulk_quick_save_bulk_edit',
                ),
            )
        );
    }

    add_action('admin_print_scripts-edit.php', 'postexpirator_quickedit_javascript');

    function postexpirator_date_save_bulk_edit()
    {
        // Save Bulk edit data
        $doAction = isset($_GET['action']) ? sanitize_key($_GET['action']) : '';
        $facade = PostExpirator_Facade::getInstance();

        if (
            'edit' !== $doAction
            || ! isset($_REQUEST['postexpirator_view'])
            || $_REQUEST['postexpirator_view'] !== 'bulk-edit'
            || ! isset($_REQUEST['expirationdate_status'])
            || sanitize_key($_REQUEST['expirationdate_status']) === 'no-change'
            || ! $facade->current_user_can_expire_posts()
        ) {
            return;
        }

        check_admin_referer('bulk-posts');

        $status = sanitize_key($_REQUEST['expirationdate_status']);

        $postIds = array_map('intval', (array)$_REQUEST['post']);

        if (empty($postIds)) {
            return;
        }

        $postType = get_post_type($postIds[0]);

        $defaults = PostExpirator_Facade::get_default_expiry($postType);

        $year = $defaults['year'];
        if (isset($_REQUEST['expirationdate_year'])) {
            $year = (int)$_REQUEST['expirationdate_year'];
        }

        $month = $defaults['month'];
        if (isset($_REQUEST['expirationdate_month'])) {
            $month = (int)$_REQUEST['expirationdate_month'];
        }

        $day = $defaults['day'];
        if (isset($_REQUEST['expirationdate_day'])) {
            $day = (int)$_REQUEST['expirationdate_day'];
        }

        $hour = $defaults['hour'];
        if (isset($_REQUEST['expirationdate_hour'])) {
            $hour = (int)$_REQUEST['expirationdate_hour'];
        }

        $minute = $defaults['minute'];
        if (isset($_REQUEST['expirationdate_minute'])) {
            $minute = (int)$_REQUEST['expirationdate_minute'];
        }

        $newExpirationDate = get_gmt_from_date("$year-$month-$day $hour:$minute:0", 'U');

        if (! $newExpirationDate) {
            return;
        }

        foreach ($postIds as $postId) {
            $postExpirationDate = get_post_meta($postId, '_expiration-date', true);

            if ($status === 'remove-only') {
                delete_post_meta($postId, '_expiration-date');
                postexpirator_unschedule_event($postId);
                continue;
            }

            $updateExpiry = ($status === 'change-only' && ! empty($postExpirationDate))
                || ($status === 'add-only' && empty($postExpirationDate))
                || $status === 'change-add';


            if ($updateExpiry) {
                $opts = PostExpirator_Facade::get_expire_principles($postId);
                $opts['expireType'] = sanitize_key($_REQUEST['expirationdate_expiretype']);

                if (in_array($opts['expireType'], array('category', 'category-add', 'category-remove'), true)) {
                    $opts['category'] = PostExpirator_Util::sanitize_array_of_integers($_REQUEST['expirationdate_category']); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
                }

                PostExpirator_Facade::set_expire_principles($postId, $opts);
                update_post_meta($postId, '_expiration-date', $newExpirationDate);
                postexpirator_schedule_event($postId, $newExpirationDate, $opts);
            }
        }
    }

    add_filter('admin_init', 'postexpirator_date_save_bulk_edit');

    /**
     * Autoloads the classes.
     */
    function postexpirator_autoload($class)
    {
        $namespaces = array('PostExpirator');
        foreach ($namespaces as $namespace) {
            if (substr($class, 0, strlen($namespace)) === $namespace) {
                $class = str_replace('_', '', strstr($class, '_'));
                $filename = POSTEXPIRATOR_BASEDIR . '/classes/' . sprintf('%s.class.php', $class);
                if (is_readable($filename)) {
                    require_once $filename;

                    return true;
                }
            }
        }

        return false;
    }

    spl_autoload_register('postexpirator_autoload');

    /**
     * Launch the plugin by initializing its helpers.
     */
    function postexpirator_launch()
    {
        PostExpirator_Facade::getInstance();
    }

    postexpirator_launch();
}
