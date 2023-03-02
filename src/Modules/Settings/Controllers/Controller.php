<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\HooksAbstract as CoreAbstractHooks;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPressFuture\Modules\Settings\SettingsFacade;

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
     * @var \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param \Closure $settingsPostTypesModelFactory
     * @param \Closure $taxonomiesModelFactory
     * @param $actionsModel
     */
    public function __construct(
        HookableInterface $hooks,
        $settings,
        $settingsPostTypesModelFactory,
        $taxonomiesModelFactory,
        $actionsModel
    ) {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ACTIVATE_PLUGIN,
            [$this, 'onActionActivatePlugin']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onActionDeactivatePlugin']
        );
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

    public function onAdminEnqueueScript()
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        if (
            (isset($_GET['page']) && $_GET['page'] === 'publishpress-future')
            && (isset($_GET['tab']) && $_GET['tab'] === 'defaults')
        ) {
            //phpcs:enable WordPress.Security.NonceVerification.Recommended
            wp_enqueue_script(
                'publishpressfuture-settings-panel',
                POSTEXPIRATOR_BASEURL . 'assets/js/settings-post-types.js',
                ['react', 'react-dom'],
                POSTEXPIRATOR_VERSION,
                true
            );

            $settingsPostTypesModelFactory = $this->settingsPostTypesModelFactory;
            $settingsModel = $settingsPostTypesModelFactory();

            $taxonomiesModelFactory = $this->taxonomiesModelFactory;
            $taxonomiesModel = $taxonomiesModelFactory();

            wp_localize_script(
                'publishpressfuture-settings-panel',
                'publishpressFutureConfig',
                [
                    'text' => [
                        'settingsSectionTitle' => __('Default Expiration Values', 'post-expirator'),
                        'settingsSectionDescription' => __(
                            'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.',
                            'post-expirator'
                        ),
                        'fieldActive' => __('Active', 'post-expirator'),
                        'fieldActiveTrue' => __('Active', 'post-expirator'),
                        'fieldActiveFalse' => __('Inactive', 'post-expirator'),
                        'fieldActiveDescription' => __(
                            'Select whether the PublishPress Future meta box is active for this post type.',
                            'post-expirator'
                        ),
                        'fieldHowToExpire' => __('How to expire', 'post-expirator'),
                        'fieldHowToExpireDescription' => __(
                            'Select the default expire action for the post type.',
                            'post-expirator'
                        ),
                        'fieldAutoEnable' => __('Auto-enable?', 'post-expirator'),
                        'fieldAutoEnableTrue' => __('Enabled', 'post-expirator'),
                        'fieldAutoEnableFalse' => __('Disabled', 'post-expirator'),
                        'fieldAutoEnableDescription' => __(
                            'Select whether the PublishPress Future is enabled for all new posts.',
                            'post-expirator'
                        ),
                        'fieldTaxonomy' => __('Taxonomy (hierarchical)', 'post-expirator'),
                        'noItemsfound' => __('No taxonomies found', 'post-expirator'),
                        'fieldTaxonomyDescription' => __(
                            'Select the hierarchical taxonomy and terms to be used for taxonomy based expiration.',
                            'post-expirator'
                        ),
                        'fieldWhoToNotify' => __('Who to notify', 'post-expirator'),
                        'fieldWhoToNotifyDescription' => __(
                            'Enter a comma separate list of emails that you would like to be notified when the post expires.',
                            'post-expirator'
                        ),
                        'fieldDefaultDateTimeOffset' => __('Default date/time offset', 'post-expirator'),
                        'fieldDefaultDateTimeOffsetDescription' => sprintf(
                            esc_html__(
                                'Set the offset to use for the default expiration date and time. For information on formatting, see %1$s. For example, you could enter %2$s+1 month%3$s or %4$s+1 week 2 days 4 hours 2 seconds%5$s or %6$snext Thursday%7$s.',
                                'post-expirator'
                            ),
                            '<a href="http://php.net/manual/en/function.strtotime.php" target="_new">' . esc_html__(
                                'PHP strtotime function',
                                'post-expirator'
                            ) . '</a>',
                            '<code>',
                            '</code>',
                            '<code>',
                            '</code>',
                            '<code>',
                            '</code>'
                        ),
                        'fieldTerm' => __('Default terms:', 'post-expirator'),
                        'saveChanges' => __('Save changes', 'post-expirator'),
                    ],
                    'settings' => $settingsModel->getPostTypesSettings(),
                    'expireTypeList' => $this->actionsModel->getActionsAsOptionsForAllPostTypes(),
                    'taxonomiesList' => $this->convertPostTypesListIntoOptionsList(
                        $taxonomiesModel->getTaxonomiesByPostType()
                    ),
                    'nonce' => wp_create_nonce('postexpirator_menu_defaults'),
                    'referrer' => esc_html(remove_query_arg('_wp_http_referer')),
                    'restUrl' => get_rest_url(),
                ]
            );
        }
    }

    private function getCurrentTab()
    {
        $allowedTabs = array('general', 'defaults', 'display', 'editor', 'diagnostics', 'viewdebug', 'advanced');

        $allowedTabs = apply_filters(SettingsHooksAbstract::FILTER_ALLOWED_TABS, $allowedTabs);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        $tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : '';

        if (empty($tab) || ! in_array($tab, $allowedTabs, true)) {
            $tab = 'general';
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

        $this->hooks->doAction(SettingsHooksAbstract::ACTION_SAVE_TAB . $tab);
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

            $_POST = \filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

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

                if (isset($_POST['expirationdate_activemeta-' . $postType])) {
                    $settings['activeMetaBox'] = \sanitize_text_field($_POST['expirationdate_activemeta-' . $postType]);
                }

                if (isset($_POST['expirationdate_emailnotification-' . $postType])) {
                    // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotValidated
                    $settings['emailnotification'] = trim(
                        \sanitize_text_field($_POST['expirationdate_emailnotification-' . $postType])
                    );
                }

                $settings['default-expire-type'] = 'custom';

                if (isset($_POST['expired-custom-date-' . $postType])) {
                    $settings['default-custom-date'] = trim(
                        \sanitize_text_field($_POST['expired-custom-date-' . $postType])
                    );
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
            // phpcs:enable
        }
    }
}
