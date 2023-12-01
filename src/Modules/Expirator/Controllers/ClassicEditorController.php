<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Display;
use PostExpirator_Facade;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;

defined('ABSPATH') or die('Direct access not allowed.');

class ClassicEditorController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade
     */
    private $sanitization;

    /**
     * @var \Closure
     */
    private $currentUserModelFactory;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\RequestFacade
     */
    private $request;

    /**
     * @param HookableInterface $hooksFacade
     * @param callable $expirablePostModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\SanitizationFacade $sanitization
     * @param \Closure $currentUserModelFactory
     * @param \PublishPress\Future\Framework\WordPress\Facade\RequestFacade $request
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $expirablePostModelFactory,
        $sanitization,
        $currentUserModelFactory,
        $request
    ) {
        $this->hooks = $hooksFacade;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->sanitization = $sanitization;
        $this->currentUserModelFactory = $currentUserModelFactory;
        $this->request = $request;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADD_META_BOX,
            [$this, 'registerClassicEditorMetabox'],
            10,
            2
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processMetaboxUpdate']
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_PRINT_SCRIPTS_EDIT,
            [$this, 'enqueueScripts']
        );
    }

    public function registerClassicEditorMetabox($columnName, $postType)
    {
        $facade = PostExpirator_Facade::getInstance();

        if (! $facade->current_user_can_expire_posts()) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $post_types = postexpirator_get_post_types();
        foreach ($post_types as $type) {
            $defaults = $settingsFacade->getPostTypeDefaults($type);

            // if settings are not configured, show the metabox by default only for posts and pages
            if (
                (
                    ! isset($defaults['activeMetaBox'])
                    && in_array($type, ['post', 'page'], true)
                )
                || (
                    is_array($defaults)
                    && (in_array((string)$defaults['activeMetaBox'], ['active', '1'], true))
                )
            ) {
                add_meta_box(
                    'expirationdatediv',
                    __('PublishPress Future', 'post-expirator'),
                    [$this, 'renderClassicEditorMetabox'],
                    $type,
                    'side',
                    'core',
                    array('__back_compat_meta_box' => PostExpirator_Facade::show_gutenberg_metabox())
                );
            }
        }
    }

    public function renderClassicEditorMetabox($post)
    {
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $isEnabled = $postModel->isExpirationEnabled();

        $data = [];

        if ('auto-draft' === $post->post_status && ! $isEnabled) {
            $data = [
                'enabled' => false,
                'date' => 0,
                'action' => '',
                'terms' => [],
                'taxonomy' => ''
            ];
        } else {
            $data = [
                'enabled' => $postModel->isExpirationEnabled(),
                'date' => $postModel->getExpirationDateString(false),
                'action' => $postModel->getExpirationType(),
                'terms' => $postModel->getExpirationCategoryIDs(),
                'taxonomy' => $postModel->getExpirationTaxonomy()
            ];
        }

        PostExpirator_Display::getInstance()->render_template(
            'classic-editor', [
                'post' => $post,
                'enabled' => $data['enabled'],
                'action' => $data['action'],
                'date' => $data['date'],
                'terms' => $data['terms'],
                'taxonomy' => $data['taxonomy']
            ]
        );
    }

    public function processMetaboxUpdate($postId)
    {
        // Don't run if this is an auto save
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Don't update data if the function is called for saving revision.
        $posttype = get_post_type((int)$postId);
        if ($posttype === 'revision') {
            return;
        }

        if (empty($_POST['future_action_view']) || $_POST['future_action_view'] !== 'classic-editor') {
            return;
        }

        $currentUserModelFactory = Container::getInstance()->get(ServicesAbstract::CURRENT_USER_MODEL_FACTORY);
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        // Don't run if was triggered by block editor. It is processed on the method "ExpirationController::handleRestAPIInit".
        if (empty($_POST['future_action_view'])) {
            return;
        }


        check_ajax_referer('__future_action', '_future_action_nonce');

        // Classic editor, quick edit
        $shouldSchedule = isset($_POST['future_action_enabled']) && $_POST['future_action_enabled'] === '1';

        if ($shouldSchedule) {
            $opts = [
                'expireType' => sanitize_text_field($_POST['future_action_action']),
                'category' => sanitize_text_field($_POST['future_action_terms']),
                'categoryTaxonomy' => sanitize_text_field($_POST['future_action_taxonomy']),
            ];

            if (! empty($opts['category'])) {
                $taxonomiesModelFactory = Container::getInstance()->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY);
                $taxonomiesModel = $taxonomiesModelFactory();

                $opts['category'] = $taxonomiesModel->normalizeTermsCreatingIfNecessary(
                    $opts['categoryTaxonomy'],
                    explode(',', $opts['category'])
                );
            }

            $date = strtotime(sanitize_text_field($_POST['future_action_date']));

            do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $date, $opts);

            return;
        }

        do_action(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
    }

    public function enqueueScripts()
    {
        wp_enqueue_script(
            'postexpirator-quick-edit',
             POSTEXPIRATOR_BASEURL . '/assets/js/quick-edit.js',
             ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element', 'inline-edit-post'],
             POSTEXPIRATOR_VERSION,
             true
        );

        wp_enqueue_script(
            'postexpirator-bulk-edit',
             POSTEXPIRATOR_BASEURL . '/assets/js/bulk-edit.js',
             ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element', 'inline-edit-post'],
             POSTEXPIRATOR_VERSION,
             true
        );

        wp_enqueue_style('wp-components');

        $currentScreen = get_current_screen();
        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);
        $actionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
        $postType = $currentScreen->post_type;

        $postTypeDefaultConfig = $settingsFacade->getPostTypeDefaults($postType);


        $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
        $defaultDataModel = $defaultDataModelFactory->create($postType);

        $debug = $container->get(ServicesAbstract::DEBUG);

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
        $nonce = wp_create_nonce('__future_action');

        wp_localize_script(
            'postexpirator-quick-edit',
            'publishpressFutureQuickEdit',
            [
                'postTypeDefaultConfig' => $postTypeDefaultConfig,
                'defaultDate' => $defaultExpirationDate['iso'],
                'is12hours' => get_option('time_format') !== 'H:i',
                'startOfWeek' => get_option('start_of_week', 0),
                'actionsSelectOptions' => $actionsModel->getActionsAsOptions($postType),
                'isDebugEnabled' => $debug->isEnabled(),
                'taxonomyName' => $taxonomyName,
                'taxonomyTerms' => $taxonomyTerms,
                'postType' => $currentScreen->post_type,
                'isNewPost' => false,
                'nonce' => $nonce,
                'strings' => [
                    'category' => __('Taxonomy', 'post-expirator'),
                    'panelTitle' => __('PublishPress Future', 'post-expirator'),
                    'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                    'action' => __('Action', 'post-expirator'),
                    'loading' => __('Loading', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'noTermsFound' => sprintf(
                        __('No %s found.', 'post-expirator'),
                        strtolower($taxonomyName)
                    ),
                    'noTaxonomyFound' => __('You must assign a hierarchical taxonomy to this post type to use this feature.', 'post-expirator'),
                ]
            ]
        );

        wp_localize_script(
            'postexpirator-bulk-edit',
            'publishpressFutureBulkEdit',
            [
                'postTypeDefaultConfig' => $postTypeDefaultConfig,
                'defaultDate' => $defaultExpirationDate['iso'],
                'is12hours' => get_option('time_format') !== 'H:i',
                'startOfWeek' => get_option('start_of_week', 0),
                'actionsSelectOptions' => $actionsModel->getActionsAsOptions($postType),
                'isDebugEnabled' => $debug->isEnabled(),
                'taxonomyName' => $taxonomyName,
                'taxonomyTerms' => $taxonomyTerms,
                'postType' => $currentScreen->post_type,
                'isNewPost' => false,
                'nonce' => $nonce,
                'strings' => [
                    'category' => __('Taxonomy', 'post-expirator'),
                    'panelTitle' => __('PublishPress Future', 'post-expirator'),
                    'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                    'action' => __('Action', 'post-expirator'),
                    'loading' => __('Loading', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'noTermsFound' => sprintf(
                        __('No %s found.', 'post-expirator'),
                        strtolower($taxonomyName)
                    ),
                    'futureActionUpdate' => __('Future Action Update', 'post-expirator'),
                    'noTaxonomyFound' => __('You must assign a hierarchical taxonomy to this post type to use this feature.', 'post-expirator'),
                    'noChange' => __('— No Change —', 'post-expirator'),
                    'changeAdd' => __('Add or update action for posts', 'post-expirator'),
                    'addOnly' => __('Add action if none exists for posts', 'post-expirator'),
                    'changeOnly' => __('Update the existing actions for posts', 'post-expirator'),
                    'removeOnly' => __('Remove action from posts', 'post-expirator'),
                ]
            ]
        );
    }
}
