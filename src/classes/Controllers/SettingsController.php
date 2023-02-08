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

    public function __construct(
        HookableInterface $hooks,
        SettingsModel $settingsModel,
        string $templatesPath
    ) {
        $this->hooks = $hooks;
        $this->templatesPath = $templatesPath;
        $this->settingsModel = $settingsModel;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_INIT,
            [$this, 'routeActions']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_AFTER_DEBUG_LOG_SETTING,
            [$this, 'renderDebugLogSetting']
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

    public function renderDebugLogSetting()
    {
        $enabled = $this->settingsModel->getWorkflowLogIsEnabled();

        include_once $this->templatesPath . '/workflow-log-setting.html.php';
    }
}
