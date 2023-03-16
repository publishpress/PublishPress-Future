<?php

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\CapabilitiesAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\PostMetaAbstract;

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
        add_action('updated_postmeta', array($this, 'onUpdatePostMeta'), 10, 4);
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
                    'pe-footer',
                    POSTEXPIRATOR_BASEURL . 'assets/css/footer.css',
                    false,
                    POSTEXPIRATOR_VERSION
                );
                wp_enqueue_style(
                    'pe-settings',
                    POSTEXPIRATOR_BASEURL . 'assets/css/settings.css',
                    ['pe-footer'],
                    POSTEXPIRATOR_VERSION
                );
                wp_enqueue_style(
                    'pe-jquery-ui',
                    POSTEXPIRATOR_BASEURL . 'assets/css/lib/jquery-ui/jquery-ui.min.css',
                    ['pe-settings'],
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
     * Fires when the post meta is updated (in the gutenberg block).
     */
    public function onUpdatePostMeta($meta_id, $post_id, $meta_key, $meta_value)
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
            case PostMetaAbstract::EXPIRATION_STATUS:
                if (empty($meta_value)) {
                    do_action(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $post_id);
                }


                break;
            case PostMetaAbstract::EXPIRATION_TIMESTAMP:
                $container = Container::getInstance();
                $postModel = ($container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY))($post_id);

                do_action(HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION, $post_id, $meta_value, $postModel->getExpirationDataAsArray());

                break;
        }
    }

    /**
     * Get the expiry type, categories etc.
     *
     * Keeps in mind the old (classic editor) and new (gutenberg) structure.
     *
     * @deprecated 3.0.0
     */
    public static function get_expire_principles($postId): array
    {
        $container = Container::getInstance();
        $actionArgsModel = ($container->get(ServicesAbstract::ACTION_ARGS_MODEL_FACTORY))();

        $actionArgsModel->loadByPostId($postId);
        $args = $actionArgsModel->getArgs();

        return array(
            'expireType' => $args['expireType'] ?? '',
            'category' => $args['category'] ?? [],
            'categoryTaxonomy' => $args['categoryTaxonomy'] ?? '',
            'enabled' => true,
        );
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
                PostMetaAbstract::EXPIRATION_STATUS,
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
                PostMetaAbstract::EXPIRATION_TIMESTAMP,
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
                PostMetaAbstract::EXPIRATION_TYPE,
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
                PostMetaAbstract::EXPIRATION_TERMS,
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
                PostMetaAbstract::EXPIRATION_DATE_OPTIONS,
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

            $defaultDataModel = $container->get(ServicesAbstract::DEFAULT_DATA_MODEL);

            $default_expiry = $defaultDataModel->getDefaultExpirationDateForPostType($post->post_type);
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

    public static function is_expiration_enabled_for_post($postId)
    {
        $container = Container::getInstance();

        return $container->get(ServicesAbstract::EXPIRATION_SCHEDULER)->isScheduled($postId);
    }
}
