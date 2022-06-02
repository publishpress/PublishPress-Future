<?php

/**
 * The class that acts as a facade for the plugin's core functions.
 *
 * Eventually, everything should move here.
 */
class PostExpirator_Facade
{

    const DEFAULT_CAPABILITY_EXPIRE_POST = 'publishpress_future_expire_post';

    /**
     * The singleton instance.
     */
    private static $instance = null;
    /**
     * List of capabilities used by the plugin.
     *
     * @var string[]
     */
    private $capabilities = array(
        'expire_post' => self::DEFAULT_CAPABILITY_EXPIRE_POST,
    );

    /**
     * Constructor.
     */
    private function __construct()
    {
        PostExpirator_Display::getInstance();
        $this->hooks();

        if (! $this->user_role_can_expire_posts('administrator')) {
            $this->set_default_capabilities();
        }
    }

    /**
     * Initialize the hooks.
     */
    private function hooks()
    {
        add_action('init', array($this, 'register_post_meta'), 100);
        add_action('enqueue_block_editor_assets', array($this, 'block_editor_assets'));
        add_action('updated_postmeta', array($this, 'updatedmeta'), 10, 4);
        add_filter('cme_plugin_capabilities', [$this, 'filter_cme_capabilities'], 20);
    }

    /**
     * Return true if the specific user role can expire posts.
     *
     * @return bool
     */
    public function user_role_can_expire_posts($user_role)
    {
        $user_role_instance = get_role($user_role);

        if (! is_a($user_role_instance, WP_Role::class)) {
            return false;
        }

        return $user_role_instance->has_cap($this->capabilities['expire_post'])
            && $user_role_instance->capabilities[$this->capabilities['expire_post']] === true;
    }

    /**
     * Set the default capabilities.
     */
    public function set_default_capabilities()
    {
        $admin_role = get_role('administrator');

        if (! is_a($admin_role, WP_Role::class)) {
            return;
        }

        $admin_role->add_cap(self::DEFAULT_CAPABILITY_EXPIRE_POST);
    }

    /**
     * Loads the assets for the particular page.
     */
    public static function load_assets($for)
    {
        switch ($for) {
            case 'settings':
                wp_enqueue_script(
                    'pe-settings',
                    POSTEXPIRATOR_BASEURL . '/assets/js/settings.js',
                    array(
                        'jquery',
                        'jquery-ui-tabs',
                    ),
                    POSTEXPIRATOR_VERSION,
                    false
                );
                wp_localize_script('pe-settings', 'config', array());
                wp_enqueue_style(
                    'pe-settings',
                    POSTEXPIRATOR_BASEURL . '/assets/css/settings.css',
                    array(),
                    POSTEXPIRATOR_VERSION,
                    false
                );
                wp_enqueue_style(
                    'pe-jquery-ui',
                    POSTEXPIRATOR_BASEURL . '/assets/css/lib/jquery-ui/jquery-ui.min.css',
                    array('pe-settings'),
                    POSTEXPIRATOR_VERSION
                );
                break;
        }
    }

    /**
     * Set the expire type, categories etc. corresponding to the new (gutenberg) structure.
     */
    public static function set_expire_principles($id, $opts)
    {
        update_post_meta($id, '_expiration-date-options', $opts);
        update_post_meta($id, '_expiration-date-type', $opts['expireType']);
        update_post_meta($id, '_expiration-date-categories', isset($opts['category']) ? $opts['category'] : array());
        update_post_meta(
            $id,
            '_expiration-date-taxonomy',
            isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : ''
        );
    }

    /**
     * Fires when the post meta is updated (in the gutenberg block).
     */
    public function updatedmeta($meta_id, $post_id, $meta_key, $meta_value)
    {
        // allow only through gutenberg
        if (! PostExpirator_Util::is_gutenberg_active()) {
            return;
        }

        // not through bulk edit.
        if (isset($_POST['post_ids'])) {
            return;
        }

        // not through quick edit.
        if (isset($_POST['expirationdate_quickedit'])) {
            return;
        }

        switch ($meta_key) {
            case '_expiration-date-status':
                if (empty($meta_value)) {
                    $this->unschedule_event($post_id);
                }


                break;
            case '_expiration-date':
                $opts = self::get_expire_principles($post_id);
                $this->schedule_event($post_id, $meta_value, $opts);

                break;
        }
    }

    /**
     * Wrapper for unscheduling event.
     */
    private function unschedule_event($post_id)
    {
        delete_post_meta($post_id, '_expiration-date');
        delete_post_meta($post_id, '_expiration-date-options');
        delete_post_meta($post_id, '_expiration-date-type');
        delete_post_meta($post_id, '_expiration-date-categories');
        delete_post_meta($post_id, '_expiration-date-taxonomy');

        postexpirator_unschedule_event($post_id);
    }

    /**
     * Get the expiry type, categories etc.
     *
     * Keeps in mind the old (classic editor) and new (gutenberg) structure.
     */
    public static function get_expire_principles($id)
    {
        $expireType = $categories = $taxonomyName = $expireStatus = '';
        $expireTypeNew = get_post_meta($id, '_expiration-date-type', true);
        if (! empty($expireTypeNew)) {
            $expireType = $expireTypeNew;
        }

        $categoriesNew = get_post_meta($id, '_expiration-date-categories', true);
        if (! empty($categoriesNew)) {
            $categories = $categoriesNew;
        }

        $taxonomyNameNew = get_post_meta($id, '_expiration-date-taxonomy', true);
        if (! empty($taxonomyNameNew)) {
            $taxonomyName = $taxonomyNameNew;
        }

        $expireStatusNew = get_post_meta($id, '_expiration-date-status', true);
        if (! empty($expireStatusNew)) {
            $expireStatus = $expireStatusNew;
        }

        // _expiration-date-options is deprecated when using block editor
        $opts = get_post_meta($id, '_expiration-date-options', true);
        if (empty($expireType) && isset($opts['expireType'])) {
            $expireType = $opts['expireType'];
        }
        if (empty($categories)) {
            $categories = isset($opts['category']) ? $opts['category'] : false;
        }

        if (empty($taxonomyName)) {
            $taxonomyName = isset($opts['categoryTaxonomy']) ? $opts['categoryTaxonomy'] : '';
        }

        return array(
            'expireType' => $expireType,
            'category' => $categories,
            'categoryTaxonomy' => $taxonomyName,
            'enabled' => self::is_expiration_enabled_for_post($id),
        );
    }

    /**
     * Wrapper for scheduling event.
     */
    private function schedule_event($post_id, $ts, $opts)
    {
        postexpirator_schedule_event($post_id, $ts, $opts);
    }

    /**
     * Register the post meta to use in the block.
     */
    public function register_post_meta()
    {
        $post_types = get_post_types(array('public' => true));
        foreach ($post_types as $post_type) {
            // this is important for CPTs to show the postMeta.
            add_post_type_support($post_type, array('custom-fields'));

            register_post_meta(
                $post_type,
                '_expiration-date-status',
                array(
                    'single' => true,
                    'type' => 'string',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'show_in_rest' => true,
                )
            );
            register_post_meta(
                $post_type,
                '_expiration-date',
                array(
                    'single' => true,
                    'type' => 'number',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'show_in_rest' => true,
                )
            );
            register_post_meta(
                $post_type,
                '_expiration-date-type',
                array(
                    'single' => true,
                    'type' => 'string',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'show_in_rest' => true,
                )
            );
            register_post_meta(
                $post_type,
                '_expiration-date-categories',
                array(
                    'single' => true,
                    'type' => 'array',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'show_in_rest' => array(
                        'schema' => array(
                            'type' => 'array',
                            'items' => array(
                                'type' => 'number',
                            ),
                        ),
                    ),
                )
            );

            // this is the old complex field that we are now deprecating
            // as it cannot be used easily in the block editor
            register_post_meta(
                $post_type,
                '_expiration-date-options',
                array(
                    'single' => true,
                    'type' => 'object',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                    'show_in_rest' => array(
                        'schema' => array(
                            'type' => 'object',
                            'additionalProperties' => true,
                        ),
                    ),
                )
            );
        }
    }

    /**
     * Load the block's backend assets only if the meta box is active for this post type.
     */
    public function block_editor_assets()
    {
        global $post;

        if (! $post || ! self::show_gutenberg_metabox()) {
            return;
        }

        $defaults = get_option('expirationdateDefaults' . ucfirst($post->post_type));
        // if settings are not configured, show the metabox by default only for posts and pages
        if (
            (! isset($defaults['activeMetaBox']) && in_array(
                    $post->post_type,
                    [
                        'post',
                        'page',
                    ],
                    true
                )) || $defaults['activeMetaBox'] === 'active'
        ) {
            wp_enqueue_script(
                'postexpirator-gutenberg-panel',
                POSTEXPIRATOR_BASEURL . 'assets/js/gutenberg-panel.js',
                ['wp-edit-post'],
                POSTEXPIRATOR_VERSION,
                true
            );

            $default_expiry = PostExpirator_Facade::get_default_expiry($post->post_type);
            wp_localize_script(
                'postexpirator-gutenberg-panel',
                'postExpiratorPanelConfig',
                [
                    'defaults' => $defaults,
                    'default_date' => $default_expiry['ts'],
                    'default_categories' => get_option('expirationdateCategoryDefaults'),
                    'is_12_hours' => get_option('time_format') !== 'H:i',
                    'timezone_offset' => PostExpirator_Util::get_timezone_offset() / 60,
                    'strings' => [
                        'category' => __('Category'),
                        'draft' => __('Draft', 'post-expirator'),
                        'delete' => __('Delete', 'post-expirator'),
                        'trash' => __('Trash', 'post-expirator'),
                        'private' => __('Private', 'post-expirator'),
                        'stick' => __('Stick', 'post-expirator'),
                        'unstick' => __('Unstick', 'post-expirator'),
                        'categoryReplace' => __('Category: Replace', 'post-expirator'),
                        'categoryAdd' => __('Category: Add', 'post-expirator'),
                        'categoryRemove' => __('Category: Remove', 'post-expirator'),
                        'postExpirator' => __('PublishPress Future', 'post-expirator'),
                        'enablePostExpiration' => __('Enable Post Expiration', 'post-expirator'),
                        'howToExpire' => __('How to expire', 'post-expirator'),
                        'loading' => __('Loading', 'post-expirator'),
                        'expirationCategories' => __('Expiration Categories', 'post-expirator'),
                    ]
                ]
            );
        }
    }

    /**
     * Is the (default) Gutenberg-style box enabled in options?
     */
    public static function show_gutenberg_metabox()
    {
        $gutenberg = get_option('expirationdateGutenbergSupport', 1);

        $facade = PostExpirator_Facade::getInstance();

        return intval($gutenberg) === 1 && $facade->current_user_can_expire_posts();
    }

    /**
     * Returns instance of the singleton.
     */
    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Returns true if the current user can expire posts.
     *
     * @return bool
     */
    public function current_user_can_expire_posts()
    {
        $current_user = wp_get_current_user();

        return is_a($current_user, WP_User::class)
            && $current_user->has_cap($this->capabilities['expire_post']);
    }

    /**
     * Calculates the default expiry date as set in the options.
     */
    public static function get_default_expiry($post_type)
    {
        $defaultmonth = date_i18n('m');
        $defaultday = date_i18n('d');
        $defaulthour = date_i18n('H');
        $defaultyear = date_i18n('Y');
        $defaultminute = date_i18n('i');
        $ts = time();

        $default_date_expiry = $custom_date = '';
        $general_date_expiry = $general_custom_date = '';

        // get the values from the general settings
        $general_date_expiry = get_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
        if ('custom' === $general_date_expiry) {
            $custom = get_option('expirationdateDefaultDateCustom');
            if ($custom !== false) {
                $general_custom_date = $custom;
            }
        }

        // get the values from the post_type
        $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));

        if (isset($defaults['default-expire-type'])) {
            $default_date_expiry = $defaults['default-expire-type'];
            switch ($default_date_expiry) {
                case 'custom':
                    $custom_date = $defaults['default-custom-date'];
                    break;
                case 'inherit':
                    $custom_date = $general_custom_date;
                    $default_date_expiry = $general_date_expiry;
                    break;
            }
        } else {
            $default_date_expiry = $general_date_expiry;
            $custom_date = $general_custom_date;
        }

        if ('custom' === $default_date_expiry) {
            $custom = get_option('expirationdateDefaultDateCustom');
            if (! empty($custom_date)) {
                $tz = get_option('timezone_string');
                if ($tz) {
                    // @TODO Using date_default_timezone_set() and similar isn't allowed, instead use WP internal timezone support.
                    // phpcs:ignore WordPress.DateTime.RestrictedFunctions.timezone_change_date_default_timezone_set
                    date_default_timezone_set($tz);
                }

                // strip the quotes in case the user provides them.
                $custom_date = str_replace('"', '', html_entity_decode($custom_date, ENT_QUOTES));

                $ts = time() + (strtotime($custom_date) - time());
                if ($tz) {
                    // @TODO Using date_default_timezone_set() and similar isn't allowed, instead use WP internal timezone support.
                    // phpcs:ignore WordPress.DateTime.RestrictedFunctions.timezone_change_date_default_timezone_set
                    date_default_timezone_set('UTC');
                }
            }
            $defaultmonth = get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'm');
            $defaultday = get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'd');
            $defaultyear = get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'Y');
            $defaulthour = get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'H');
            $defaultminute = get_date_from_gmt(gmdate('Y-m-d H:i:s', $ts), 'i');
        }

        return array(
            'month' => $defaultmonth,
            'day' => $defaultday,
            'year' => $defaultyear,
            'hour' => $defaulthour,
            'minute' => $defaultminute,
            'ts' => $ts,
        );
    }

    /**
     * Add the plugin capabilities to the PublishPress Capabilities plugin.
     *
     * @param array $capabilities Array of capabilities.
     *
     * @return array
     */
    public function filter_cme_capabilities($capabilities)
    {
        return array_merge(
            $capabilities,
            array(
                'PublishPress Future' => array(self::DEFAULT_CAPABILITY_EXPIRE_POST),
            )
        );
    }

    public static function is_expiration_enabled_for_post($post_id)
    {
        $statusEnabled = get_post_meta($post_id, '_expiration-date-status', true) === 'saved';
        $date = (int)get_post_meta($post_id, '_expiration-date', true);

        return $statusEnabled && false === empty($date);
    }
}
