<?php

namespace PublishPress\FuturePro\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\FuturePro\Core\HooksAbstract;
use PublishPress\FuturePro\Models\CustomStatusesModel;
use PublishPress\FuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

defined('ABSPATH') or die('No direct script access allowed.');

class SettingsController implements ModuleInterface
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $templatesPath;
    /**
     * @var \PublishPress\FuturePro\Models\SettingsModel
     */
    private $settingsModel;

    private $eddContainer;

    /**
     * @var int
     */
    private $eddItemId;

    /**
     * @var string
     */
    private $assetsUrl;

    /**
     * @var string
     */
    private $pluginVersion;

    /**
     * @var \PublishPress\FuturePro\Models\CustomStatusesModel
     */
    private $customStatusesModel;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooks
     * @param \PublishPress\FuturePro\Models\SettingsModel $settingsModel
     * @param \PublishPress\FuturePro\Models\CustomStatusesModel $customStatusesModel
     * @param string $templatesPath
     * @param string $assetsUrl
     * @param $eddContainer
     * @param int $eddItemId
     * @param string $pluginVersion
     */
    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel,
        CustomStatusesModel $customStatusesModel,
        $templatesPath,
        $assetsUrl,
        $eddContainer,
        $eddItemId,
        $pluginVersion
    ) {
        $this->hooks = $hooks;
        $this->templatesPath = $templatesPath;
        $this->settingsModel = $settingsModel;
        $this->eddContainer = $eddContainer;
        $this->eddItemId = $eddItemId;
        $this->assetsUrl = $assetsUrl;
        $this->pluginVersion = $pluginVersion;
        $this->customStatusesModel = $customStatusesModel;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_INIT,
            [$this, 'routeActions']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPT,
            [$this, 'adminEnqueueScript']
        );

        $this->hooks->addFilter(
            HooksAbstract::FILTER_ALLOWED_TABS,
            [$this, 'filterAllowedTabs']
        );

        $this->hooks->addAction(
            HooksAbstract::FILTER_SETTINGS_TABS,
            [$this, 'filterSettingsTabs']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_LOAD_TAB,
            [$this, 'loadTabs']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_SAVE_LICENSE_TAB,
            [$this, 'saveTabLicense']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_SAVE_POST_TYPE_SETTINGS,
            [$this, 'savePostTypeSettings'],
            10,
            2
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_SAVE_ADVANCED_SETTINGS,
            [$this, 'saveAdvancedSettings']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_SETTINGS_TAB_ADVANCED_BEFORE,
            [$this, 'settingsTabAdvancedBefore']
        );
    }

    public function routeActions()
    {
        if (
            ! isset($_GET['page'])
            || $_GET['page'] !== 'publishpress-future'
            || ! isset($_GET['tab'])
            || $_GET['tab'] !== 'diagnostics'
        ) {
            return;
        }

        if (isset($_GET['action'])) {
            if (
                ! isset($_GET['nonce']) ||
                ! wp_verify_nonce(sanitize_key($_GET['nonce']), 'workflow-logs-settings')
            ) {
                wp_die('Invalid nonce');
            }

            if (! current_user_can('manage_options')) {
                wp_die('You do not have permission to do this');
            }
        }
    }

    public function adminEnqueueScript()
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        if (
            ! isset($_GET['page'])
            || $_GET['page'] !== 'publishpress-future'
            || ! isset($_GET['tab'])
        ) {
            return;
        }

        if ($_GET['tab'] === 'defaults') {
            wp_enqueue_script(
                'publishpress-future-pro-settings-panel',
                $this->assetsUrl . '/js/settings.js',
                ['wp-components', 'wp-url', 'wp-data', 'wp-element'],
                $this->pluginVersion,
                true
            );

            wp_enqueue_script('wp-url');
            wp_enqueue_script('wp-element');
            wp_enqueue_script('wp-components');
            wp_enqueue_script('wp-data');

            wp_localize_script(
                'publishpress-future-pro-settings-panel',
                'publishpressFutureProSettings',
                [
                    'text' => [
                        'enablePostExpiration' => __('Enable Future Action', 'post-expirator'),
                        'enableCustomStatuses' => __('Custom statuses', 'publishpress-future-pro'),
                        'enableCustomStatusesDesc' => __(
                            'Enable custom statuses for the post type:',
                            'publishpress-future-pro'
                        ),
                        'enableCustomStatusesTrue' => __('Enabled', 'publishpress-future-pro'),
                        'enableCustomStatusesFalse' => __('Disabled', 'publishpress-future-pro'),
                        'selectAll' => __('Select all', 'publishpress-future-pro'),
                        'unselectAll' => __('Unselect all', 'publishpress-future-pro'),
                    ],
                    'settings' => $this->settingsModel->getSettings(),
                    'customPostStatuses' => $this->customStatusesModel->getCustomStatusesAsOptions(),
                ]
            );
        }

        if (in_array($_GET['tab'], ['license', 'defaults'], true)) {
            wp_enqueue_style(
                'publishpress-future-settings-style',
                $this->assetsUrl . '/css/settings.css',
                ['wp-components'],
                $this->pluginVersion
            );

            wp_enqueue_style('wp-components');
        }

        // phpcs:enable WordPress.Security.NonceVerification.Recommended
    }

    public function filterAllowedTabs($tabs)
    {
        $tabs[] = 'license';

        return $tabs;
    }

    public function filterSettingsTabs($tabs)
    {
        $tabs[] = [
            'title' => 'License',
            'slug' => 'license',
            'link' => admin_url('admin.php?page=publishpress-future&tab=license'),
        ];

        return $tabs;
    }

    public function loadTabs()
    {
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($_GET['tab']) && $_GET['tab'] === 'license') {
            include $this->templatesPath . '/settings-tab-license.html.php';
        }
    }

    public function saveTabLicense()
    {
        if (isset($_GET['tab']) && $_GET['tab'] === 'license') {
            if (
                ! isset($_POST['_future_license_nonce']) || ! \wp_verify_nonce(
                    \sanitize_key($_POST['_future_license_nonce']),
                    'postexpirator_menu_license'
                )
            ) {
                wp_die(esc_html__('Form Validation Failure: Sorry, your nonce did not verify.', 'publishpress-future-pro'));
            }

            // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
            $_POST = \filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

            $license_key = isset($_POST['license_key']) ? $_POST['license_key'] : '';

            $this->settingsModel->setLicenseKey($license_key);

            $status = $this->validateLicenseKey($license_key);
            $this->settingsModel->setLicenseStatus($status);
            // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        }
    }

    /**
     * @param string $licenseKey
     *
     * @return string
     */
    private function validateLicenseKey($licenseKey)
    {
        $licenseManager = $this->eddContainer['license_manager'];

        return $licenseManager->validate_license_key($licenseKey, $this->eddItemId);
    }

    /**
     * @param array  $settings
     * @param string $postType
     */
    public function savePostTypeSettings($settings, $postType)
    {
        // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $_POST = \filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

        $this->settingsModel->setEnabledCustomStatusForPostType(
            $postType,
            isset($_POST['expirationdate_custom-statuses-' . $postType])
                ? $_POST['expirationdate_custom-statuses-' . $postType] : []
        );

        // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
    }

    public function deleteAllSettings()
    {
        $this->settingsModel->deleteAllSettings();
    }

    public function settingsTabAdvancedBefore()
    {
        include $this->templatesPath . '/settings-tab-advanced.html.php';
    }

    public function saveAdvancedSettings()
    {
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $baseDate = $_POST['future-action-base-date'] ?? 'current';
        $baseDate = $baseDate === 'publishing' ? 'publishing' : 'current';

        $this->settingsModel->setBaseDate($baseDate);
    }
}
