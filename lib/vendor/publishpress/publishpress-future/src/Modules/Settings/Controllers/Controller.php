<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreAbstractHooks;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class Controller implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SettingsFacade
     */
    private $settings;

    /**
     * @var array $defaultData
     */
    private $defaultData;

    /**
     * @var \Closure
     */
    private $settingsPostTypesModelFactory;

    /**
     * @var \Closure
     */
    private $taxonomiesModelFactory;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;

    /**
     * @var \Closure
     */
    private $migrationsFactory;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param \Closure $settingsPostTypesModelFactory
     * @param \Closure $taxonomiesModelFactory
     * @param $actionsModel
     * @param \Closure $migrationsFactory
     */
    public function __construct(
        HookableInterface $hooks,
        $settings,
        $settingsPostTypesModelFactory,
        $taxonomiesModelFactory,
        $actionsModel,
        $migrationsFactory
    ) {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;
        $this->migrationsFactory = $migrationsFactory;
    }

    public function initialize()
    {
        $this->hooks->addFilter(
            SettingsHooksAbstract::FILTER_DEBUG_ENABLED,
            [$this, 'onFilterDebugEnabled']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, 'onAdminEnqueueScript'],
            15
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ADMIN_INIT,
            [$this, 'processFormSubmission']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_INIT,
            [$this, 'initMigrations'],
            20
        );
    }

    public function onActionActivatePlugin()
    {
        $this->settings->setDefaultSettings();
    }

    public function onActionDeactivatePlugin()
    {
        if ($this->settings->getSettingPreserveData()) {
            return;
        }

        $this->hooks->doAction(SettingsHooksAbstract::ACTION_DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }

    public function onFilterDebugEnabled($enabled = false)
    {
        return $this->settings->getDebugIsEnabled($enabled);
    }

    private function convertPostTypesListIntoOptionsList($list)
    {
        $optionsList = [];

        foreach ($list as $postType => $taxonomiesList) {
            $optionsList[$postType] = [];

            if (empty($taxonomiesList)) {
                continue;
            }

            foreach ($taxonomiesList as $taxonomySlug => $taxonomyObject) {
                $optionsList[$postType][] = ['value' => $taxonomySlug, 'label' => $taxonomyObject->label];
            }
        }

        return $optionsList;
    }

    public function onAdminEnqueueScript($screenId)
    {
        if ($screenId !== 'toplevel_page_publishpress-future') {
            return;
        }

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

        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        if (
            (isset($_GET['page']) && $_GET['page'] === 'publishpress-future')
            && (
                (! isset($_GET['tab']) || empty($_GET['tab']))
                || (isset($_GET['tab']) && $_GET['tab'] === 'defaults')
            )
        ) {
            //phpcs:enable WordPress.Security.NonceVerification.Recommended
            wp_enqueue_script(
                'publishpressfuture-settings-panel',
                POSTEXPIRATOR_BASEURL . 'assets/js/settings-post-types.js',
                ['wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-element', 'wp-hooks', 'wp-api-fetch', 'wp-html-entities'],
                POSTEXPIRATOR_VERSION,
                true
            );

            wp_enqueue_style('wp-components');

            $settingsPostTypesModelFactory = $this->settingsPostTypesModelFactory;
            $settingsModel = $settingsPostTypesModelFactory();

            $taxonomiesModelFactory = $this->taxonomiesModelFactory;
            $taxonomiesModel = $taxonomiesModelFactory();

            wp_localize_script(
                'publishpressfuture-settings-panel',
                'publishpressFutureSettingsConfig',
                [
                    'text' => [
                        'settingsSectionTitle' => __('Default Values', 'post-expirator'),
                        'settingsSectionDescription' => __(
                            'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.',
                            'post-expirator'
                        ),
                        'fieldActive' => __('Active', 'post-expirator'),
                        'fieldActiveLabel' => __('Activate the PublishPress Future actions for this post type', 'post-expirator'),
                        'fieldHowToExpire' => __('Default Action', 'post-expirator'),
                        'fieldHowToExpireDescription' => __(
                            'Select the default action for the post type.',
                            'post-expirator'
                        ),
                        'fieldTaxonomyDescription' => __(
                            'Select the taxonomy to be used for actions.',
                            'post-expirator'
                        ),
                        'fieldAutoEnable' => __('Auto-enable', 'post-expirator'),
                        'fieldAutoEnableLabel' => __('Enabled for all new posts', 'post-expirator'),
                        'fieldTaxonomy' => __('Taxonomy', 'post-expirator'),
                        'noItemsfound' => __('No taxonomies found for this post type. Taxonomy actions will not be available.', 'post-expirator'),
                        'fieldWhoToNotify' => __('Who to Notify', 'post-expirator'),
                        'fieldWhoToNotifyDescription' => __(
                            'Enter a comma separated list of emails that you would like to be notified when the action runs.',
                            'post-expirator'
                        ),
                        'fieldDefaultDateTimeOffset' => __('Default Date/Time Offset', 'post-expirator'),
                        'fieldDefaultDateTimeOffsetDescription' => sprintf(
                            // translators: %1$s is the link to the PHP strtotime function documentation, %2$s and %3$s are the opening and closing code tags. Please, do not translate the date format text, since PHP will not be able to calculate using non-english terms.
                            esc_html__(
                                'Set the offset to use for the default action date and time. For information on formatting, see %1$s
                                . For example, you could enter %2$s+1 month%3$s or %2$s+1 week 2 days 4 hours 2 seconds%3$s or %2$snext Thursday%3$s. Please, use only terms in English.',
                                'post-expirator'
                            ),
                            '<a href="https://www.php.net/manual/en/function.strtotime.php" target="_new">' . esc_html__('PHP strtotime function', 'post-expirator') . '</a>',
                            '<code>',
                            '</code>'
                        ),
                        'fieldTerm' => __('Default terms:', 'post-expirator'),
                        'saveChanges' => __('Save changes', 'post-expirator'),
                        'saveChangesPendingValidation' => __('Wait for the validation...', 'post-expirator'),
                        // translators: %s is the name of the taxonomy in singular form.
                        'errorTermsRequired' => __('Please select one or more %s', 'post-expirator'),
                        'datePreview' => __('Date Preview', 'post-expirator'),
                    ],
                    'settings' => $settingsModel->getPostTypesSettings(),
                    'expireTypeList' => $this->actionsModel->getActionsAsOptionsForAllPostTypes(false),
                    'statusesList' => $this->actionsModel->getStatusesAsOptionsForAllPostTypes(),
                    'taxonomiesList' => $this->convertPostTypesListIntoOptionsList(
                        $taxonomiesModel->getTaxonomiesByPostType(false)
                    ),
                    'nonce' => wp_create_nonce('postexpirator_menu_defaults'),
                    'referrer' => esc_html(remove_query_arg('_wp_http_referer')),
                ]
            );
        }
    }

    private function getCurrentTab()
    {
        $allowedTabs = [
            'defaults',
            'general',
            'display',
            'diagnostics',
            'viewdebug',
            'advanced',
        ];

        $allowedTabs = $this->hooks->applyFilters(SettingsHooksAbstract::FILTER_ALLOWED_TABS, $allowedTabs);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : '';

        if (empty($tab) || ! in_array($tab, $allowedTabs, true)) {
            $tab = 'defaults';
        }

        return $tab;
    }

    public function processFormSubmission()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Missing
        if (empty($_POST)) {
            return;
        }

        $tab = $this->getCurrentTab();

        $methodName = 'saveTab' . ucfirst($tab);
        if (method_exists($this, $methodName)) {
            call_user_func([$this, $methodName]);
        }

        $this->hooks->doAction(SettingsHooksAbstract::ACTION_SAVE_TAB_PREFIX . $tab);
    }

    public function initMigrations()
    {
        $factory = $this->migrationsFactory;
        $factory();
    }

    private function convertTermsToIds($taxonomy, $terms)
    {
        if (empty($terms)) {
            return [];
        }

        $taxonomiesModelFactory = $this->taxonomiesModelFactory;
        $taxonomiesModel = $taxonomiesModelFactory();

        $terms = explode(',', $terms);
        $terms = array_map(function($term) use ($taxonomy, $taxonomiesModel) {
            $term = \sanitize_text_field($term);
            $termId = $taxonomiesModel->getTermIdByName($taxonomy, $term);

            if (! $termId) {
                $termId = $taxonomiesModel->createTermAndReturnId(
                    $taxonomy,
                    $term
                );
            }

            return $termId;
        }, $terms);

        return $terms;
    }

    private function saveTabDefaults()
    {
        $settingsPostTypesModelFactory = $this->settingsPostTypesModelFactory;
        $settingsModel = $settingsPostTypesModelFactory();

        $postTypes = $settingsModel->getPostTypes();

        if (isset($_POST['expirationdateSaveDefaults'])) {
            if (! isset($_POST['_postExpiratorMenuDefaults_nonce']) || ! \wp_verify_nonce(
                    \sanitize_key($_POST['_postExpiratorMenuDefaults_nonce']),
                    'postexpirator_menu_defaults'
                )) {
                wp_die(esc_html__('Form Validation Failure: Sorry, your nonce did not verify.', 'post-expirator'));
            }

            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            foreach ($postTypes as $postType) {
                $settings = [];

                if (isset($_POST['expirationdate_expiretype-' . $postType])) {
                    $settings['expireType'] = \sanitize_key($_POST['expirationdate_expiretype-' . $postType]);
                }

                if (isset($_POST['expirationdate_autoenable-' . $postType])) {
                    $settings['autoEnable'] = \intval($_POST['expirationdate_autoenable-' . $postType]);
                }

                if (isset($_POST['expirationdate_taxonomy-' . $postType])) {
                    $settings['taxonomy'] = \sanitize_text_field($_POST['expirationdate_taxonomy-' . $postType]);
                }

                if (isset($_POST['expirationdate_terms-' . $postType])) {
                    $settings['terms'] = \sanitize_text_field($_POST['expirationdate_terms-' . $postType]);
                }

                $settings['activeMetaBox'] = '0';
                if (isset($_POST['expirationdate_activemeta-' . $postType])) {
                    $settings['activeMetaBox'] = \sanitize_text_field($_POST['expirationdate_activemeta-' . $postType]);
                }

                if (isset($_POST['expirationdate_emailnotification-' . $postType])) {
                    // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                    $settings['emailnotification'] = trim(
                        \sanitize_text_field($_POST['expirationdate_emailnotification-' . $postType])
                    );
                }

                if (isset($settings['taxonomy']) && isset($settings['terms'])) {
                    $settings['terms'] = $this->convertTermsToIds($settings['taxonomy'], $settings['terms']);
                }

                if (isset($_POST['expirationdate_newstatus-' . $postType])) {
                    $settings['newStatus'] = \sanitize_key($_POST['expirationdate_newstatus-' . $postType]);
                }

                $settings['default-expire-type'] = 'custom';

                if (isset($_POST['expired-custom-date-' . $postType])) {
                    $customExpirationDate = \sanitize_text_field($_POST['expired-custom-date-' . $postType]);
                    $customExpirationDate = html_entity_decode($customExpirationDate, ENT_QUOTES);
                    $customExpirationDate = preg_replace('/[\'"`]/', '', $customExpirationDate);

                    $settings['default-custom-date'] = trim($customExpirationDate);
                }

                $settings = $this->hooks->applyFilters(
                    SettingsHooksAbstract::FILTER_SAVE_DEFAULTS_SETTINGS,
                    $settings,
                    $postType
                );

                $this->hooks->doAction(
                    SettingsHooksAbstract::ACTION_SAVE_POST_TYPE_SETTINGS,
                    $settings,
                    $postType
                );

                // Save Settings
                $settingsModel->updatePostTypesSettings($postType, $settings);
            }

            $this->hooks->doAction(
                SettingsHooksAbstract::ACTION_SAVE_ALL_POST_TYPES_SETTINGS,
                $settings,
                $postTypes
            );

            // phpcs:enable
        }

        $this->hooks->doAction(CoreAbstractHooks::ACTION_PURGE_PLUGIN_CACHE);
    }
}
