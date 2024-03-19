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
use PublishPress\Future\Modules\Expirator\ExpirationActions\ChangePostStatus;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;

defined('ABSPATH') or die('Direct access not allowed.');

class QuickEditController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param HookableInterface $hooksFacade
     */
    public function __construct(HookableInterface $hooksFacade)
    {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_QUICK_EDIT_CUSTOM_BOX,
            [$this, 'registerQuickEditCustomBox'],
            10,
            2
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_SAVE_POST,
            [$this, 'processQuickEditUpdate']
        );

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_PRINT_SCRIPTS_EDIT,
            [$this, 'enqueueScripts']
        );
    }

    public function registerQuickEditCustomBox($columnName, $postType)
    {
        $facade = PostExpirator_Facade::getInstance();

        if (
            ($columnName !== 'expirationdate')
            || (! $facade->current_user_can_expire_posts())
        ) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

        $defaults = $settingsFacade->getPostTypeDefaults($postType);
        $taxonomy = isset($defaults['taxonomy']) ? $defaults['taxonomy'] : '';
        $label = '';

        // if settings have not been configured and this is the default post type
        if (empty($taxonomy) && 'post' === $postType) {
            $taxonomy = 'category';
        }

        if (! empty($taxonomy)) {
            $tax_object = get_taxonomy($taxonomy);
            $label = $tax_object ? $tax_object->label : '';
        }

        PostExpirator_Display::getInstance()->render_template('quick-edit', array(
            'post_type' => $postType,
            'taxonomy' => $taxonomy,
            'tax_label' => $label
        ));
    }

    public function processQuickEditUpdate($postId)
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

        if (empty($_POST['future_action_view']) || $_POST['future_action_view'] !== 'quick-edit') {
            return;
        }

        $currentUserModelFactory = Container::getInstance()->get(ServicesAbstract::CURRENT_USER_MODEL_FACTORY);
        $currentUserModel = $currentUserModelFactory();

        if (! $currentUserModel->userCanExpirePosts()) {
            return;
        }

        check_ajax_referer('__future_action', '_future_action_nonce');

        // Classic editor, quick edit
        $shouldSchedule = isset($_POST['future_action_enabled']) && $_POST['future_action_enabled'] === '1';

        if ($shouldSchedule) {
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

            $date = isset($_POST['future_action_date']) ? sanitize_text_field($_POST['future_action_date']) : '0';
            $date = strtotime($date);

            $this->hooks->doAction(ExpiratorHooks::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $date, $opts);

            return;
        }

        $this->hooks->doAction(ExpiratorHooks::ACTION_UNSCHEDULE_POST_EXPIRATION, $postId);
    }

    public function enqueueScripts()
    {
        wp_enqueue_script(
            'postexpirator-quick-edit',
             POSTEXPIRATOR_BASEURL . '/assets/js/quick-edit.js',
             ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element', 'inline-edit-post', 'wp-html-entities'],
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

        $taxonomyPluralName= '';
        if (! empty($postTypeDefaultConfig['taxonomy'])) {
            $taxonomy = get_taxonomy($postTypeDefaultConfig['taxonomy']);

            if (! is_wp_error($taxonomy) && ! empty($taxonomy)) {
                $taxonomyPluralName = $taxonomy->label;
            }
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
            'publishpressFutureQuickEditConfig',
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
                'isNewPost' => false,
                'nonce' => $nonce,
                'strings' => [
                    'category' => __('Categories', 'post-expirator'),
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
