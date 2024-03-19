<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Facade;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class BlockEditorController implements InitializableInterface
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
            'enqueue_block_editor_assets',
            [$this, 'enqueueBlockEditorAssets']
        );
    }

    public function enqueueBlockEditorAssets()
    {
        global $post;

        if (! $post) {
            return;
        }

        $container = Container::getInstance();
        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);
        $actionsModel = $container->get(ServicesAbstract::EXPIRATION_ACTIONS_MODEL);
        $options = $container->get(ServicesAbstract::OPTIONS);

        $postTypeDefaultConfig = $settingsFacade->getPostTypeDefaults($post->post_type);
        $hideMetabox = (bool)$this->hooks->applyFilters(HooksAbstract::FILTER_HIDE_METABOX, false, $post->post_type);

        // if settings are not configured, show the metabox by default only for posts and pages
        if (
            $hideMetabox === false
            && (
                ! isset($postTypeDefaultConfig['activeMetaBox'])
                && in_array(
                    $post->post_type,
                    [
                        'post',
                        'page',
                    ],
                    true
                )
                || (in_array((string)$postTypeDefaultConfig['activeMetaBox'], ['active', '1']))
            )
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

            $taxonomyPluralName = '';
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

            $defaultExpirationDate = $defaultDataModel->getActionDateParts($post->ID);

            wp_localize_script(
                'postexpirator-block-editor',
                'publishpressFutureBlockEditorConfig',
                [
                    'postTypeDefaultConfig' => $postTypeDefaultConfig,
                    'defaultDate' => $defaultExpirationDate['iso'],
                    'is12Hour' => $options->getOption('time_format') !== 'H:i',
                    'timeFormat' => $settingsFacade->getTimeFormatForDatePicker(),
                    'startOfWeek' => $options->getOption('start_of_week', 0),
                    'actionsSelectOptions' => $actionsModel->getActionsAsOptions($post->post_type),
                    'statusesSelectOptions' => $actionsModel->getStatusesAsOptionsForPostType($post->post_type),
                    'isDebugEnabled' => $container->get(ServicesAbstract::DEBUG)->isEnabled(),
                    'taxonomyName' => $taxonomyPluralName,
                    'taxonomyTerms' => $taxonomyTerms,
                    'strings' => [
                        'category' => __('Categories', 'post-expirator'),
                        'panelTitle' => __('PublishPress Future', 'post-expirator'),
                        'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                        'action' => __('Action', 'post-expirator'),
                        'loading' => __('Loading', 'post-expirator'),
                        'showCalendar' => __('Show Calendar', 'post-expirator'),
                        'hideCalendar' => __('Hide Calendar', 'post-expirator'),
                        // translators: the text between {} is the link to the settings page.
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
}
