<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\CapabilitiesAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

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
        add_action('enqueue_block_editor_assets', array($this, 'block_editor_assets'));
        add_filter('cme_plugin_capabilities', [$this, 'filter_cme_capabilities'], 20);
        add_action('rest_api_init', [$this, 'register_rest_api']);
    }

    /**
     * Return true if the specific user role can run future actions.
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
     * Get the expiry type, categories etc.
     *
     * Keeps in mind the old (classic editor) and new (gutenberg) structure.
     *
     * @deprecated 3.0.0
     * @return array
     */
    public static function get_expire_principles($postId)
    {
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::ACTION_ARGS_MODEL_FACTORY);

        $actionArgsModel = $factory();

        $actionArgsModel->loadByPostId($postId);
        $args = $actionArgsModel->getArgs();

        return array(
            'expireType' => isset($args['expireType']) ? $args['expireType'] : '',
            'category' => isset($args['category']) ? $args['category'] : [],
            'categoryTaxonomy' => isset($args['categoryTaxonomy']) ? $args['categoryTaxonomy'] : '',
            'enabled' => true,
        );
    }

    public function register_rest_api()
    {
        $apiNamespace = 'publishpress-future/v1';

        register_rest_route( $apiNamespace, '/post-expiration/(?P<postId>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_expiration_data'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postId' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
            ]
        ]);

        register_rest_route($apiNamespace, '/post-expiration/(?P<postId>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'api_save_expiration_data'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postId' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
                'enabled' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_bool($param);
                    },
                    'sanitize_callback' => 'sanitize_text_field',
                    'required' => false,
                    'type' => 'bool',
                ],
                'date' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_numeric($param);
                    },
                    'sanitize_callback' => 'absint',
                    'required' => true,
                    'type' => 'integer',
                ],
                'action' => [
                    'validate_callback' => function ($param, $request, $key) {
                        // Get available future action actions using the service EXPIRATION_ACTIONS_MODEL.
                        $container = Container::getInstance();
                        $expirationActionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
                        $expirationActions = array_keys($expirationActionsModel->getActions());

                        return in_array($param, $expirationActions) || $param === '';
                    },
                    'sanitize_callback' => 'sanitize_text_field',
                    'required' => true,
                    'type' => 'string',
                ],
                'terms' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return is_array($param);
                    },
                    'sanitize_callback' => function ($param, $request, $key) {
                        return array_map('absint', $param);
                    },
                    'required' => true,
                    'type' => 'array',
                ],
            ]
        ]);

        register_rest_route( $apiNamespace, '/taxonomies/(?P<postType>[a-z\-_0-9A-Z]+)', [
            'methods' => 'GET',
            'callback' => [$this, 'api_get_post_type_taxonomies'],
            'permission_callback' => function () {
                return current_user_can(CapabilitiesAbstract::EXPIRE_POST);
            },
            'args' => [
                'postType' => [
                    'validate_callback' => function ($param, $request, $key) {
                        return sanitize_key($param);
                    },
                    'sanitize_callback' => 'sanitize_key',
                    'required' => true,
                    'type' => 'string',
                ],
            ]
        ]);
    }

    public function api_get_expiration_data(WP_REST_Request $request)
    {
        $postId = $request->get_param('postId');
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $expirablePostModel = $factory($postId);

        $data = $expirablePostModel->getExpirationDataAsArray();

        // return the data as a JSON response
        return rest_ensure_response( $data );
    }

    public function api_save_expiration_data(WP_REST_Request $request)
    {
        $postId = absint($request->get_param('postId'));

        $expirationEnabled = (bool)$request->get_param('enabled');

        if ($expirationEnabled) {
            $opts = [
                'expireType' => sanitize_key($request->get_param('action')),
                'category' => array_map('absint', (array)$request->get_param('terms')),
                'categoryTaxonomy' => sanitize_key($request->get_param('taxonomy'))
            ];

            do_action(HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION, $postId, absint($request->get_param('date')), $opts);
        } else {
            do_action(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
        }

        return rest_ensure_response(true);
    }

    public function api_get_post_type_taxonomies(WP_REST_Request $request)
    {
        $postType = $request->get_param('postType');

        $taxonomies = get_object_taxonomies($postType, 'objects');
        $taxonomies = array_map(function ($taxonomy) {
            return [
                'name' => $taxonomy->name,
                'label' => $taxonomy->label,
            ];
        }, $taxonomies);

        return rest_ensure_response(['taxonomies' => $taxonomies, 'count' => count($taxonomies)]);
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
        $options = $container->get(ServicesAbstract::OPTIONS);

        $postTypeDefaultConfig = $settingsFacade->getPostTypeDefaults($post->post_type);

        // if settings are not configured, show the metabox by default only for posts and pages
        if (
            (! isset($postTypeDefaultConfig['activeMetaBox'])
                && in_array(
                    $post->post_type,
                    [
                        'post',
                        'page',
                    ],
                    true
                )
            )
            || (in_array((string)$postTypeDefaultConfig['activeMetaBox'], ['active', '1']))
        ) {
            wp_enqueue_script(
                'postexpirator-block-editor',
                POSTEXPIRATOR_BASEURL . 'assets/js/block-editor.js',
                ['wp-edit-post'],
                POSTEXPIRATOR_VERSION,
                true
            );

            $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
            $defaultDataModel = $defaultDataModelFactory->create($post->post_type);

            $taxonomyName= '';
            if (! empty($postTypeDefaultConfig['taxonomy'])) {
                $taxonomy = get_taxonomy($postTypeDefaultConfig['taxonomy']);
                $taxonomyName = $taxonomy->label;
            }

            $taxonomyTerms = [];
            if (! empty($postTypeDefaultConfig['taxonomy'])) {
                $taxonomyTerms = get_terms([
                    'taxonomy' => $postTypeDefaultConfig['taxonomy'],
                    'hide_empty' => false,
                ]);
            }

            $defaultExpirationDate = $defaultDataModel->getActionDateParts();
            wp_localize_script(
                'postexpirator-block-editor',
                'postExpiratorPanelConfig',
                [
                    'postTypeDefaultConfig' => $postTypeDefaultConfig,
                    'defaultDate' => $defaultExpirationDate['iso'],
                    'is12hours' => $options->getOption('time_format') !== 'H:i',
                    'startOfWeek' => $options->getOption('start_of_week', 0),
                    'actionsSelectOptions' => $actionsModel->getActionsAsOptions($post->post_type),
                    'isDebugEnabled' => $container->get(ServicesAbstract::DEBUG)->isEnabled(),
                    'taxonomyName' => $taxonomyName,
                    'taxonomyTerms' => $taxonomyTerms,
                    'strings' => [
                        'category' => __('Taxonomy', 'post-expirator'),
                        'panelTitle' => __('PublishPress Future', 'post-expirator'),
                        'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                        'action' => __('Action', 'post-expirator'),
                        'loading' => __('Loading', 'post-expirator'),
                        'showCalendar' => __('Show Calendar', 'post-expirator'),
                        'hideCalendar' => __('Hide Calendar', 'post-expirator'),
                        // translators: the text between {} is the link to the settings page.
                        'timezoneSettingsHelp' => __('Timezone settings can be changed on {WordPress General Settings}.', 'post-expirator'),
                        // translators: %s is the name of the taxonomy in plural form.
                        'noTermsFound' => sprintf(
                            __('No %s found.', 'post-expirator'),
                            strtolower($taxonomyName)
                        ),
                        'noTaxonomyFound' => __('You must assign a hierarchical taxonomy to this post type to use this feature.', 'post-expirator'),
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
