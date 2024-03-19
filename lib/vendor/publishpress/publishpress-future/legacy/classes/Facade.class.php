<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\CapabilitiesAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * The class that acts as a facade for the plugin's core functions.
 *
 * Eventually, everything should move here.
 */
class PostExpirator_Facade
{
    /**
     * The singleton instance.
     */
    private static $instance = null;

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
        $container = Container::getInstance();
        $hooks = $container->get(ServicesAbstract::HOOKS);

        $hooks->addFilter('cme_plugin_capabilities', [$this, 'filter_cme_capabilities'], 20);
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
            'newStatus' => isset($args['newStatus']) ? $args['newStatus'] : 'draft',
            'category' => isset($args['category']) ? $args['category'] : [],
            'categoryTaxonomy' => isset($args['categoryTaxonomy']) ? $args['categoryTaxonomy'] : '',
            'enabled' => true,
        );
    }

    /**
     * Is the (default) Gutenberg-style box enabled in options?
     *
     * @deprecated 3.1.5
     */
    public static function show_gutenberg_metabox()
    {
        _deprecated_function(__METHOD__, '3.1.5', 'Gutenberg plugin is mandatory now. This will always return true.');

        return true;
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
