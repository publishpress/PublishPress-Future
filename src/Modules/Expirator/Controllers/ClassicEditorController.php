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
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;

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
    private $currentUserModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param \Closure $currentUserModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        $currentUserModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->currentUserModelFactory = $currentUserModelFactory;
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
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS,
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

        $postTypesModel = new PostTypesModel($container);
        $postTypes = $postTypesModel->getPostTypes();

        foreach ($postTypes as $type) {
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
                    []
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
                'expireType' => isset($_POST['future_action_action']) ? sanitize_text_field($_POST['future_action_action']) : '',
                'category' => isset($_POST['future_action_terms']) ? sanitize_text_field($_POST['future_action_terms']) : '',
                'categoryTaxonomy' => isset($_POST['future_action_taxonomy']) ? sanitize_text_field($_POST['future_action_taxonomy']) : '',
            ];

            if (! empty($opts['category'])) {
                $taxonomiesModelFactory = Container::getInstance()->get(ServicesAbstract::TAXONOMIES_MODEL_FACTORY);
                $taxonomiesModel = $taxonomiesModelFactory();

                $opts['category'] = $taxonomiesModel->normalizeTermsCreatingIfNecessary(
                    $opts['categoryTaxonomy'],
                    explode(',', $opts['category'])
                );
            }

            $date = isset($_POST['future_action_date']) ? sanitize_text_field($_POST['future_action_date']) : '';
            $date = strtotime($date);

            do_action(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $date, $opts);

            return;
        }

        do_action(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
    }

    public function enqueueScripts()
    {
        $currentScreen = get_current_screen();

        if ($currentScreen->base !== 'post') {
            return;
        }

        $isNewPostPage = $currentScreen->action === 'add';
        $isEditPostPage = ! empty($_GET['action']) && ($_GET['action'] === 'edit'); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        if (! $isEditPostPage && ! $isNewPostPage) {
            return;
        }

        $currentUserModelFactory = $this->currentUserModelFactory;
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);
        $actionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
        $postType = $currentScreen->post_type;

        $postTypeDefaultConfig = $settingsFacade->getPostTypeDefaults($postType);

        if (! in_array((string)$postTypeDefaultConfig['activeMetaBox'], ['active', '1', true])) {
            return;
        }

        wp_enqueue_script(
            'publishpress-future-classic-editor',
            POSTEXPIRATOR_BASEURL . 'assets/js/classic-editor.js',
            ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element'],
            PUBLISHPRESS_FUTURE_VERSION,
            true
        );

        wp_enqueue_style(
            'publishpress-future-classic-editor',
            POSTEXPIRATOR_BASEURL . 'assets/css/edit.css',
            ['wp-components'],
            PUBLISHPRESS_FUTURE_VERSION
        );

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

        wp_localize_script(
            'publishpress-future-classic-editor',
            'publishpressFutureClassicEditorConfig',
            [
                'postTypeDefaultConfig' => $postTypeDefaultConfig,
                'defaultDate' => $defaultExpirationDate['iso'],
                'is12Hour' => get_option('time_format') !== 'H:i',
                'startOfWeek' => get_option('start_of_week', 0),
                'actionsSelectOptions' => $actionsModel->getActionsAsOptions($postType),
                'isDebugEnabled' => $debug->isEnabled(),
                'taxonomyName' => $taxonomyName,
                'taxonomyTerms' => $taxonomyTerms,
                'postType' => $currentScreen->post_type,
                'isNewPost' => $isNewPostPage,
                'strings' => [
                    'category' => __('Category', 'post-expirator'),
                    'panelTitle' => __('PublishPress Future', 'post-expirator'),
                    'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                    'action' => __('Action', 'post-expirator'),
                    'showCalendar' => __('Show Calendar', 'post-expirator'),
                    'hideCalendar' => __('Hide Calendar', 'post-expirator'),
                    'loading' => __('Loading', 'post-expirator'),
                    // translators: the text between {{}} is the link to the settings page.
                    'timezoneSettingsHelp' => __('Timezone is controlled by the {WordPress Settings}.', 'post-expirator'),
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
