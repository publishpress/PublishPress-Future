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
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\PostTypesModel;
use WP_Post;

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
            CoreHooksAbstract::ACTION_ADD_META_BOXES,
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

    private function isGutenbergAvailableForThePost($post)
    {
        if (! function_exists('use_block_editor_for_post')) {
            return false;
        }

        // Some 3rd party plugins send the post as an object of a different class.
        // Try to fallback to the WP_Post class looking for the ID.
        if ((! $post instanceof WP_Post) && is_object($post)) {
            $id = null;
            if (isset($post->ID)) {
                $id = $post->ID;
            } elseif (isset($post->post_id)) {
                $id = $post->post_id;
            } elseif (isset($post->id)) {
                $id = $post->id;
            } else {
                if (method_exists($post, 'get_id')) {
                    $id = $post->get_id();
                }
            }

            if (! is_null($id)) {
                $post = get_post($id);
            }
        }

        if (! $post instanceof WP_Post) {
            return false;
        }

        return use_block_editor_for_post($post);
    }

    private function classicEditorIsActiveForCurrentSession()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        return isset($_GET['classic-editor']);
    }

    public function registerClassicEditorMetabox($postType, $post)
    {
        $factory = $this->currentUserModelFactory;
        $currentUserModel = $factory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        // Only show the metabox if the block editor is not enabled for the post type
        if (! empty($post) && $this->isGutenbergAvailableForThePost($post)) {
            if (! $this->classicEditorIsActiveForCurrentSession() ) {
                return;
            }
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $defaults = $settingsFacade->getPostTypeDefaults($postType);
        $hideMetabox = (bool)$this->hooks->applyFilters(HooksAbstract::FILTER_HIDE_METABOX, false, $postType);

        // if settings are not configured, show the metabox by default only for posts and pages
        if (
            $hideMetabox === false
            &&
            (
                (
                    ! isset($defaults['activeMetaBox'])
                    && in_array($postType, ['post', 'page'], true)
                )
                || (
                    is_array($defaults)
                    && (in_array((string)$defaults['activeMetaBox'], ['active', '1'], true))
                )
            )
        ) {
            add_meta_box(
                'expirationdatediv',
                __('PublishPress Future', 'post-expirator'),
                [$this, 'renderClassicEditorMetabox'],
                $postType,
                'side',
                'core',
                []
            );
        }
    }

    public function renderClassicEditorMetabox($post)
    {
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $data = [
            'enabled' => $postModel->isExpirationEnabled(),
            'date' => $postModel->getExpirationDateString(false),
            'action' => $postModel->getExpirationType(),
            'newStatus' => $postModel->getExpirationNewStatus(),
            'terms' => $postModel->getExpirationCategoryIDs(),
            'taxonomy' => $postModel->getExpirationTaxonomy()
        ];

        PostExpirator_Display::getInstance()->render_template(
            'classic-editor', [
                'post' => $post,
                'enabled' => $data['enabled'],
                'action' => $data['action'],
                'newStatus' => $data['newStatus'],
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

        if (! $shouldSchedule) {
            $this->hooks->doAction(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);

            return;
        }

        $expireType = isset($_POST['future_action_action']) ? sanitize_text_field($_POST['future_action_action']) : '';
        $newStatus = isset($_POST['future_action_new_status']) ? sanitize_text_field($_POST['future_action_new_status']) : 'draft';

        if ($expireType === ExpirationActionsAbstract::POST_STATUS_TO_DRAFT) {
            $expireType = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $newStatus = 'draft';
        }

        if ($expireType === ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE) {
            $expireType = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $newStatus = 'private';
        }

        if ($expireType === ExpirationActionsAbstract::POST_STATUS_TO_TRASH) {
            $expireType = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $newStatus = 'trash';
        }

        $opts = [
            'expireType' => $expireType,
            'newStatus' => $newStatus,
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

        $this->hooks->doAction(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $date, $opts);
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

        $hideMetabox = (bool)$this->hooks->applyFilters(HooksAbstract::FILTER_HIDE_METABOX, false, $postType);
        if ($hideMetabox) {
            return;
        }

        wp_enqueue_script(
            'publishpress-future-classic-editor',
            POSTEXPIRATOR_BASEURL . 'assets/js/classic-editor.js',
            ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element', 'wp-html-entities'],
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

        $taxonomyPluralName= '';
        if (! empty($postTypeDefaultConfig['taxonomy'])) {
            $taxonomy = get_taxonomy($postTypeDefaultConfig['taxonomy']);
            $taxonomyPluralName = $taxonomy->label;
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
                'timeFormat' => $settingsFacade->getTimeFormatForDatePicker(),
                'startOfWeek' => get_option('start_of_week', 0),
                'actionsSelectOptions' => $actionsModel->getActionsAsOptions($postType),
                'statusesSelectOptions' => $actionsModel->getStatusesAsOptionsForPostType($postType),
                'isDebugEnabled' => $debug->isEnabled(),
                'taxonomyName' => $taxonomyPluralName,
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
                        // translators: %s is the name of the taxonomy in plural form.
                        __('No %s found.', 'post-expirator'),
                        strtolower($taxonomyPluralName)
                    ),
                    'noTaxonomyFound' => __('You must assign a taxonomy to this post type to use this feature.', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'newTerms' => __('New %s', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'removeTerms' => __('%s to remove', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in plural form.
                    'addTerms' => __('%s to add', 'post-expirator'),
                    // translators: %s is the name of the taxonomy in singular form.
                    'addTermsPlaceholder' => sprintf(__('Search for %s', 'post-expirator'), strtolower($taxonomyPluralName)),
                    'errorActionRequired' => __('Select an action', 'post-expirator'),
                    'errorDateRequired' => __('Select a date', 'post-expirator'),
                    'errorDateInPast' => __('Date cannot be in the past', 'post-expirator'),
                    'errorTermsRequired' => sprintf(
                        // translators: %s is the name of the taxonomy in singular form.
                        __('Please select one or more %s', 'post-expirator'),
                        strtolower($taxonomyPluralName)
                    ),
                    'newStatus' => __('New status', 'post-expirator'),
                ]
            ]
        );
    }
}
