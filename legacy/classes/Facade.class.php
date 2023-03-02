<?php

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\CapabilitiesAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract;

/**
 * The class that acts as a facade for the plugin's core functions.
 *
 * Eventually, everything should move here.
 */
class PostExpirator_Facade
{

    /**
     * @deprecated 2.8.0 Use CapabilitiesAbstract::EXPIRE_POST;
     */
    const DEFAULT_CAPABILITY_EXPIRE_POST = CapabilitiesAbstract::EXPIRE_POST;

    /**
     * The singleton instance.
     */
    private static $instance = null;

    /**
     * List of capabilities used by the plugin.
     *
     * @var string[]
     * @deprecated 2.8.0
     */
    private $capabilities = array(
        'expire_post' => CapabilitiesAbstract::EXPIRE_POST,
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

        return $user_role_instance->has_cap(CapabilitiesAbstract::EXPIRE_POST)
            && $user_role_instance->capabilities[CapabilitiesAbstract::EXPIRE_POST] === true;
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

        $admin_role->add_cap(CapabilitiesAbstract::EXPIRE_POST);
    }

    /**
     * Loads the assets for the particular page.
     */
    public static function load_assets($for)
    {
        switch ($for) {
            case 'settings':
                wp_enqueue_style(
                    'pe-settings',
                    POSTEXPIRATOR_BASEURL . 'assets/css/settings.css',
                    array(),
                    POSTEXPIRATOR_VERSION,
                    false
                );
                wp_enqueue_style(
                    'pe-jquery-ui',
                    POSTEXPIRATOR_BASEURL . 'assets/css/lib/jquery-ui/jquery-ui.min.css',
                    array('pe-settings'),
                    POSTEXPIRATOR_VERSION
                );
                wp_enqueue_style(
                    'pp-wordpress-banners-style',
                    POSTEXPIRATOR_BASEURL . 'assets/vendor/wordpress-banners/css/style.css',
                    false,
                    POSTEXPIRATOR_VERSION
                );
                break;
        }
    }

    /**
     * Set the expire type, categories etc. corresponding to the new (gutenberg) structure.
     *
     * @deprecated 2.8.0
     */
    public static function set_expire_principles($id, $opts)
    {
        update_post_meta($id, '_expiration-date-options', $opts);
        update_post_meta($id, '_expiration-date-type', $opts['expireType']);
        update_post_meta($id, '_expiration-date-categories', isset($opts['category']) ? (array)$opts['category'] : []);
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
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if (isset($_POST['post_ids'])) {
            return;
        }

        // not through quick edit.
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
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

        $categoriesNew = (array)get_post_meta($id, '_expiration-date-categories', true);
        if (! empty($categoriesNew)) {
            $categories = $categoriesNew;
        }

        $taxonomyNameNew = get_post_meta($id, '_expiration-date-taxonomy', true);
        if (! empty($taxonomyNameNew)) {
            $taxonomyName = $taxonomyNameNew;
        }

        // _expiration-date-options is deprecated when using block editor
        $opts = get_post_meta($id, '_expiration-date-options', true);
        if (empty($expireType) && isset($opts['expireType'])) {
            $expireType = $opts['expireType'];
        }
        if (empty($categories)) {
            $categories = isset($opts['category']) ? $opts['category'] : [];
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
        do_action(HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION, $post_id, $ts, $opts);
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
                            'properties' => []
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

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);
        $actionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);

        $defaults = $settingsFacade->getPostTypeDefaults($post->post_type);

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
                    'actions_options' => $actionsModel->getActionsAsOptions($post->post_type),
                    'strings' => [
                        'category' => __('Taxonomy', 'post-expirator'),
                        'postExpirator' => __('PublishPress Future', 'post-expirator'),
                        'enablePostExpiration' => __('Enable Post Expiration', 'post-expirator'),
                        'howToExpire' => __('How to expire', 'post-expirator'),
                        'loading' => __('Loading', 'post-expirator'),
                        'expirationCategories' => __('Expiration Taxonomies', 'post-expirator'),
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
     * @deprecated 2.8.0
     */
    public function current_user_can_expire_posts()
    {
        $container = Container::getInstance();
        $currentUserModelFactory = $container->get(ServicesAbstract::CURRENT_USER_MODEL_FACTORY);

        $currentUserModel = $currentUserModelFactory();

        return $currentUserModel->userCanExpirePosts();
    }

    /**
     * Calculates the default expiry date as set in the options.
     *
     * @deprecated 2.8.0
     */
    public static function get_default_expiry($post_type)
    {
        $container = Container::getInstance();
        $defaultDataModel = $container->get(ServicesAbstract::DEFAULT_DATA_MODEL);

        return $defaultDataModel->getDefaultExpirationDateForPostType($post_type);
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
                'PublishPress Future' => [CapabilitiesAbstract::EXPIRE_POST],
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
