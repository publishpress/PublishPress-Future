<?php

namespace PublishPress\Future\Modules\Backup\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;

class BackupAdminPage implements InitializableInterface
{
    private HookableInterface $hooks;

    private SettingsFacade $settingsFacade;

    public function __construct(
        HookableInterface $hooks,
        SettingsFacade $settingsFacade
    ) {
        $this->hooks = $hooks;
        $this->settingsFacade = $settingsFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_MENU,
            [$this, 'addSubmenuPage'],
            14
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS,
            [$this, 'enqueueAdminScripts']
        );
    }

    public function addSubmenuPage()
    {
        add_submenu_page(
            'publishpress-future',
            'Export / Import',
            'Export / Import',
            'manage_options',
            'future-backup',
            [$this, 'renderSubmenuPage'],
        );
    }

    public function renderSubmenuPage()
    {
        $showSideBar = $this->hooks->applyFilters(
            SettingsHooksAbstract::FILTER_SHOW_PRO_BANNER,
            ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
        );

        include __DIR__ . '/../Views/debug-panel.php';
    }

    public function enqueueAdminScripts()
    {
        if (! function_exists('get_current_screen')) {
            return;
        }

        $currentScreen = get_current_screen();
        if ($currentScreen->id !== 'future_page_future-backup') {
            return;
        }

        wp_enqueue_style("wp-components");
        wp_enqueue_style("wp-edit-post");
        wp_enqueue_style("wp-editor");
        wp_enqueue_style("wp-notices");

        wp_enqueue_script("wp-url");
        wp_enqueue_script("wp-element");
        wp_enqueue_script("wp-components");
        wp_enqueue_script("wp-data");
        wp_enqueue_script("wp-plugins");
        wp_enqueue_script("wp-notices");
        wp_enqueue_script("wp-api-fetch");

        wp_enqueue_script(
            'future_backup_panel',
            Plugin::getScriptUrl('backupPanel'),
            [
                'wp-i18n',
                'wp-components',
                'wp-url',
                'wp-data',
                'wp-element',
                'wp-hooks',
                'wp-api-fetch',
            ],
            PUBLISHPRESS_FUTURE_VERSION,
            true
        );

        wp_localize_script(
            'future_backup_panel',
            'futureBackupPanelData',
            [
                'apiRoot' => esc_url_raw(rest_url()),
                'enableWorkflowScreenshot' => $this->settingsFacade->getWorkflowScreenshotStatus(),
            ]
        );

        wp_set_script_translations(
            'future_backup_panel',
            'post-expirator',
            PUBLISHPRESS_FUTURE_BASE_PATH . '/languages'
        );

        wp_enqueue_style(
            'pe-footer',
            POSTEXPIRATOR_BASEURL . 'assets/css/footer.css',
            false,
            PUBLISHPRESS_FUTURE_VERSION
        );

        wp_enqueue_style(
            'pe-settings',
            POSTEXPIRATOR_BASEURL . 'assets/css/settings.css',
            ['pe-footer'],
            PUBLISHPRESS_FUTURE_VERSION
        );

        wp_enqueue_style(
            'pp-wordpress-banners-style',
            POSTEXPIRATOR_BASEURL . 'assets/vendor/wordpress-banners/css/style.css',
            false,
            PUBLISHPRESS_FUTURE_VERSION
        );
    }
}
