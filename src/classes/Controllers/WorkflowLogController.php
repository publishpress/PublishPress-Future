<?php

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Models\SettingsModel;
use PublishPressFuturePro\Models\WorkflowLogModel;
use PublishPressFuturePro\Tables\WorkflowLogTable;

use function current_user_can;
use function wp_die;
use function wp_verify_nonce;

class WorkflowLogController implements ModuleInterface
{
    /**
     * @var \PublishPressFuture\Core\HookableInterface
     */
    private $hooks;

    /**
     * @var \PublishPressFuturePro\Models\WorkflowLogModel
     */
    private $modelWorkflowLog;

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
        WorkflowLogModel $modelWorkflowLog,
        SettingsModel $settingsModel,
        string $templatesPath
    ) {
        $this->hooks = $hooks;
        $this->modelWorkflowLog = $modelWorkflowLog;
        $this->templatesPath = $templatesPath;
        $this->settingsModel = $settingsModel;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ACTIVATE_PLUGIN,
            [$this, 'onActivatePlugin']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onDeactivatePlugin']
        );

        if ($this->settingsModel->getWorkflowLogIsEnabled()) {
            $this->hooks->addAction(
                HooksAbstract::ACTION_ADMIN_MENU,
                [$this, 'adminMenu']
            );

            $this->hooks->addAction(
                HooksAbstract::ACTION_ADMIN_INIT,
                [$this, 'routeActions']
            );

            $this->hooks->addAction(
                HooksAbstract::ACTION_POST_EXPIRED,
                [$this, 'logPostExpired'],
                10,
                2
            );
        }
    }

    public function logPostExpired(int $postId, string $expirationLog)
    {
        $this->modelWorkflowLog->add($postId, $expirationLog);
    }

    public function adminMenu()
    {
        add_submenu_page(
            'publishpress-future',
            __('Log', 'publishpress'),
            __('Log', 'publishpress'),
            'manage_options',
            'publishpress-future-log',
            [$this, 'renderLogPage']
        );
    }

    public function renderLogPage()
    {
        $table = new WorkflowLogTable();
        $table->prepare_items();

        include_once $this->templatesPath . '/workflow-log.html.php';
    }

    public function onActivatePlugin()
    {
        WorkflowLogModel::createTableIfNotExists();
    }

    public function onDeactivatePlugin()
    {
        if (! $this->settingsModel->getPreserveDataOnDeactivation()) {
            WorkflowLogModel::dropTableIfExists();
        }
    }

    public function routeActions()
    {
        if (
            ! isset($_GET['page'])
            || $_GET['page'] !== 'publishpress-future-log'
        ) {
            return;
        }

        if (isset($_GET['action']) && $_GET['action'] === 'delete-all-logs') {
            if (
                ! isset($_GET['nonce']) ||
                ! wp_verify_nonce(sanitize_key($_GET['nonce']), 'delete-all-logs')
            ) {
                wp_die('Invalid nonce');
            }

            if (current_user_can('manage_options')) {
                $this->modelWorkflowLog->deleteAll();
            }
        }
    }
}
