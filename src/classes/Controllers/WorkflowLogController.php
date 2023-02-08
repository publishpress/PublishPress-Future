<?php

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Models\WorkflowLogModel;
use PublishPressFuturePro\Tables\WorkflowLogTable;

use function wp_verify_nonce;
use function wp_die;
use function current_user_can;

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
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;
    /**
     * @var string
     */
    private $basePath;

    public function __construct(HookableInterface $hooks, WorkflowLogModel $modelWorkflowLog, OptionsFacade $options, string $basePath)
    {
        $this->hooks = $hooks;
        $this->modelWorkflowLog = $modelWorkflowLog;
        $this->options = $options;
        $this->basePath = $basePath;
    }


    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_POST_EXPIRED,
            [$this, 'logPostExpired'],
            10,
            2
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_ACTIVATE_PLUGIN,
            [$this, 'onActivatePlugin']
        );

        $this->hooks->addAction(
            HooksAbstract::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onDeactivatePlugin']
        );

        $this->hooks->addAction(
            HooksAbstract::ADMIN_MENU,
            [$this, 'adminMenu']
        );

        $this->hooks->addAction(
            HooksAbstract::ADMIN_INIT,
            [$this, 'routeActions']
        );
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
            'publishpress_future_log',
            [$this, 'renderLogPage']
        );
    }

    public function renderLogPage()
    {
        $table = new WorkflowLogTable();
        $table->prepare_items();

        include_once $this->basePath . '/src/templates/workflow-log.html.php';
    }

    public function onActivatePlugin()
    {
        WorkflowLogModel::createTableIfNotExists();
    }

    public function onDeactivatePlugin()
    {
        $preserveData = (bool)$this->options->getOption('expirationdatePreserveData', 1);

        if (! $preserveData) {
            // Deactivate the Pro plugin.
            WorkflowLogModel::dropTableIfExists();
        }
    }

    public function routeActions()
    {
        if (isset($_GET['action']) && $_GET['action'] === 'delete-all-logs') {
            if (! isset($_GET['nonce']) ||
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
