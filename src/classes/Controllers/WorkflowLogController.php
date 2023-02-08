<?php

namespace PublishPressFuturePro\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuturePro\Core\HooksAbstract;
use PublishPressFuturePro\Models\WorkflowLogModel;

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

    public function __construct(HookableInterface $hooks, WorkflowLogModel $modelWorkflowLog, OptionsFacade $options)
    {
        $this->hooks = $hooks;
        $this->modelWorkflowLog = $modelWorkflowLog;
        $this->options = $options;
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
    }

    public function logPostExpired(int $postId, string $expirationLog)
    {
        $this->modelWorkflowLog->add($postId, $expirationLog);
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
}
