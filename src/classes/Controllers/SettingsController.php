<?php

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuturePro\Core\HooksAbstract;
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

    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel,
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
            HooksAbstract::ACTION_SAVE_TAB . 'license',
            [$this, 'saveTabLicense']
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
        if (
            ! isset($_GET['page'])
            || $_GET['page'] !== 'publishpress-future'
            || ! isset($_GET['tab'])
            || $_GET['tab'] !== 'license'
        ) {
            return;
        }

        wp_enqueue_style(
            'publishpress-future-settings-style',
            $this->assetsUrl . '/css/settings.css',
            [],
            $this->pluginVersion
        );
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
                wp_die(__('Form Validation Failure: Sorry, your nonce did not verify.', 'publishpress-future-pro'));
            }

            $_POST = \filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

            $this->settingsModel->setLicenseKey($_POST['license_key']);

            $status = $this->validateLicenseKey($_POST['license_key']);
            $this->settingsModel->setLicenseStatus($status);
        }
    }

    private function validateLicenseKey($licenseKey): string
    {
        $licenseManager = $this->eddContainer['license_manager'];

        return $licenseManager->validate_license_key($licenseKey, $this->eddItemId);
    }
}
