<?php

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Models\CustomStatusesModel;
use PublishPressFuturePro\Models\SettingsModel;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

class SettingsController implements ModuleInterface
{
    /**
     * @var \PublishPressFuture\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $templatesPath;
    /**
     * @var \PublishPressFuturePro\Models\SettingsModel
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
     * @var \PublishPressFuturePro\Models\CustomStatusesModel
     */
    private $customStatusesModel;

    /**
     * @param \PublishPressFuture\Core\HookableInterface $hooks
     * @param \PublishPressFuturePro\Models\SettingsModel $settingsModel
     * @param \PublishPressFuturePro\Models\CustomStatusesModel $customStatusesModel
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
        string $templatesPath,
        string $assetsUrl,
        $eddContainer,
        int $eddItemId,
        string $pluginVersion
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

        $this->hooks->addAction(
            HooksAbstract::ACTION_AFTER_DEBUG_LOG_SETTING,
            [$this, 'renderDebugLogSetting']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_MENU,
            [$this, 'adminMenu']
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
            HooksAbstract::ACTION_DELETE_ALL_SETTINGS,
            [$this, 'deleteAllSettings']
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

            switch ($_GET['action']) {
                case 'enable-workflow-logs':
                    $this->settingsModel->setWorkflowLogIsEnabled(1);
                    break;

                case 'disable-workflow-logs':
                    $this->settingsModel->setWorkflowLogIsEnabled(0);
                    break;
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
                ['react', 'react-dom'],
                $this->pluginVersion,
                true
            );

            wp_localize_script(
                'publishpress-future-pro-settings-panel',
                'publishpressFutureProSettings',
                [
                    'text' => [
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
                [],
                $this->pluginVersion
            );
        }

        // phpcs:enable WordPress.Security.NonceVerification.Recommended
    }

    public function renderDebugLogSetting()
    {
        $enabled = $this->settingsModel->getWorkflowLogIsEnabled();

        include_once $this->templatesPath . '/workflow-log-setting.html.php';
    }

    public function adminMenu()
    {
        global $submenu;

        if (isset($submenu['publishpress-future']) && isset($submenu['publishpress-future'][0])) {
            $submenu['publishpress-future'][0][0] = 'Settings';
        }
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

            $license_key = $_POST['license_key'] ?? '';

            $this->settingsModel->setLicenseKey($license_key);

            $status = $this->validateLicenseKey($license_key);
            $this->settingsModel->setLicenseStatus($status);
            // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        }
    }

    private function validateLicenseKey($licenseKey): string
    {
        $licenseManager = $this->eddContainer['license_manager'];

        return $licenseManager->validate_license_key($licenseKey, $this->eddItemId);
    }

    public function savePostTypeSettings(array $settings, string $postType)
    {
        // phpcs:disable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
        $_POST = \filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

        $this->settingsModel->setEnabledCustomStatusForPostType(
            $postType,
            $_POST['expirationdate_custom-statuses-' . $postType] ?? []
        );

        // phpcs:enable WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.NonceVerification.Missing
    }

    public function deleteAllSettings()
    {
        $this->settingsModel->deleteAllSettings();
    }
}
