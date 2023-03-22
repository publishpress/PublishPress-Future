<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Controllers;

use ActionScheduler;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\Models\ActionArgsModel;
use PublishPressFuture\Modules\Expirator\Tables\ScheduledActionsTable as ScheduledActionsTable;

class ScheduledActionsController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;
    /**
     * @var \Closure
     */
    private $actionArgsModelFactory;

    /**
     * @var ScheduledActionsTable
     */
    private $listTable;

    /**
     * @var \Closure
     */
    private $scheduledActionsTableFactory;

    /**
     * @param HookableInterface $hooksFacade
     */
    public function __construct(
        HookableInterface $hooksFacade,
        \Closure $actionArgsModelFactory,
        \Closure $scheduledActionsTableFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->actionArgsModelFactory = $actionArgsModelFactory;
        $this->scheduledActionsTableFactory = $scheduledActionsTableFactory;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_MENU,
            [$this, 'onAdminMenu']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULER_DELETED_ACTION,
            [$this, 'onActionSchedulerDeletedAction']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULER_CANCELED_ACTION,
            [$this, 'onActionSchedulerDisableAction']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULER_AFTER_EXECUTE,
            [$this, 'onActionSchedulerDisableAction']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULER_FAILED_EXECUTION,
            [$this, 'onActionSchedulerDisableAction']
        );
    }

    public function onAdminMenu()
    {
        add_menu_page(
            __('PublishPress Future', 'post-expirator'),
            __('Future', 'post-expirator'),
            'manage_options',
            'publishpress-future',
            [\PostExpirator_Display::getInstance(), 'settings_tabs'],
            'dashicons-clock',
            74
        );

        $hook_suffix = add_submenu_page(
            'publishpress-future',
            __('Future Actions', 'post-expirator'),
            __('Future Actions', 'post-expirator'),
            'manage_options',
            'publishpress-future-scheduled-actions',
            [$this, 'renderScheduledActionsTemplate']
        );
        add_action( 'load-' . $hook_suffix , [$this, 'processAdminUi']);

        global $submenu;

        if (isset($submenu['publishpress-future']) && isset($submenu['publishpress-future'][0])) {
            $tmpMenu = $submenu['publishpress-future'][0];
            $tmpMenu[0] = __('Settings', 'post-expirator');

            $submenu['publishpress-future'][0] = $submenu['publishpress-future'][1];
            $submenu['publishpress-future'][1] = $tmpMenu;
        }
    }

    public function renderScheduledActionsTemplate()
    {
        $table = $this->getListTable();
        $table->display_page();

        \PostExpirator_Display::getInstance()->publishpress_footer();
    }

    public function onActionSchedulerDeletedAction($actionId)
    {
        $actionArgsModel = ($this->actionArgsModelFactory)();
        if ($actionArgsModel->loadByActionId($actionId)) {
            $actionArgsModel->delete();
        };
    }

    public function onActionSchedulerDisableAction($actionId)
    {
        $actionArgsModel = ($this->actionArgsModelFactory)();
        if ($actionArgsModel->loadByActionId($actionId)) {
            $actionArgsModel->setEnabled(false)->save();
        };
    }

    private function getListTable(): ScheduledActionsTable
    {
        if (null === $this->listTable) {
            $this->listTable = ($this->scheduledActionsTableFactory)();
            $this->listTable->process_actions();
        }

        return $this->listTable;
    }

    public function processAdminUi()
    {
        $this->getListTable();
    }
}
