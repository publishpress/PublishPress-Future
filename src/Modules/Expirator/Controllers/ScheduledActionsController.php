<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\Tables\ScheduledActionsTable as ScheduledActionsTable;

defined('ABSPATH') or die('Direct access not allowed.');

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
        $this->hooks->addFilter('screen_settings', [$this, 'filterScreenSettings'], 10, 2);
        $this->hooks->addFilter('set-screen-option', [$this, 'filterSetScreenOption'], 10);

        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_ADMIN_ENQUEUE_SCRIPTS,
            [$this, 'enqueueScripts']
        );

        $this->hooks->addFilter(
            HooksAbstract::FILTER_ACTION_SCHEDULER_ADMIN_NOTICE,
            [$this, 'filterActionSchedulerAdminNotice'],
            10,
            3
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
        add_submenu_page(
            'publishpress-future',
            __('Action Settings', 'post-expirator'),
            __('Action Settings', 'post-expirator'),
            'manage_options',
            'publishpress-future',
            [\PostExpirator_Display::getInstance(), 'settings_tabs']
        );

        $hook_suffix = add_submenu_page(
            'publishpress-future',
            __('Scheduled Actions', 'post-expirator'),
            __('Scheduled Actions', 'post-expirator'),
            'manage_options',
            'publishpress-future-scheduled-actions',
            [$this, 'renderScheduledActionsTemplate']
        );
        add_action('load-' . $hook_suffix, [$this, 'processAdminUi']);
    }

    public function renderScheduledActionsTemplate()
    {
        $table = $this->getListTable();
        $table->display_page();

        \PostExpirator_Display::getInstance()->publishpress_footer();
    }

    public function onActionSchedulerDeletedAction($actionId)
    {
        $factory = $this->actionArgsModelFactory;
        $actionArgsModel = $factory();
        if ($actionArgsModel->loadByActionId($actionId)) {
            $actionArgsModel->delete();
        };
    }

    public function onActionSchedulerDisableAction($actionId)
    {
        $factory = $this->actionArgsModelFactory;
        $actionArgsModel = $factory();
        if ($actionArgsModel->loadByActionId($actionId)) {
            $actionArgsModel->setEnabled(false);
            $actionArgsModel->save();
        };
    }

    /**
     * @return \PublishPress\Future\Modules\Expirator\Tables\ScheduledActionsTable
     */
    private function getListTable()
    {
        if (null === $this->listTable) {
            $factory = $this->scheduledActionsTableFactory;
            $this->listTable = $factory();
            $this->listTable->process_actions();
        }

        return $this->listTable;
    }

    public function processAdminUi()
    {
        $this->getListTable();
    }

    public function filterScreenSettings($screenSettings, $screen)
    {
        if ($screen->id !== 'future_page_publishpress-future-scheduled-actions') {
            return $screenSettings;
        }

        $userLogFormat = get_user_meta(get_current_user_id(), 'publishpressfuture_actions_log_format', true);
        if (empty($userLogFormat)) {
            $userLogFormat = 'list';
        }

        // Add nonce field
        $screenSettings .= wp_nonce_field('publishpressfuture_actions_log_format', 'publishpressfuture_actions_log_format_nonce', true, false);

        $screenSettings .= '<fieldset class="metabox-prefs">';
        $screenSettings .= '<legend>' . esc_html__('Log format', 'post-expirator') . '</legend>';
        $screenSettings .= '<label for="' . $screen->id . '_log_format_list">';
        $screenSettings .= '<input type="radio" id="' . $screen->id . '_log_format_list" name="publishpressfuture_actions_log_format" value="list" ' . checked(
            $userLogFormat,
            'list',
            false
        ) . '>';
        $screenSettings .= esc_html__('List', 'post-expirator');
        $screenSettings .= '</label>';
        $screenSettings .= '&nbsp;';
        $screenSettings .= '<label for="' . $screen->id . '_log_format_popup">';
        $screenSettings .= '<input type="radio" id="' . $screen->id . '_log_format_popup" name="publishpressfuture_actions_log_format" value="popup" ' . checked(
            $userLogFormat,
            'popup',
            false
        ) . '>';
        $screenSettings .= esc_html__('Popup', 'post-expirator');
        $screenSettings .= '</label>';

        $screenSettings .= '</fieldset>';

        return $screenSettings;
    }

    public function filterSetScreenOption($status)
    {
        if (
            ! isset($_POST['publishpressfuture_actions_log_format_nonce']) || ! wp_verify_nonce(
                sanitize_key($_POST['publishpressfuture_actions_log_format_nonce']),
                'publishpressfuture_actions_log_format'
            )
        ) {
            return $status;
        }

        if (isset($_POST['publishpressfuture_actions_log_format'])) {
            update_user_meta(
                get_current_user_id(),
                'publishpressfuture_actions_log_format',
                sanitize_key($_POST['publishpressfuture_actions_log_format'])
            );
        } else {
            delete_user_meta(get_current_user_id(), 'publishpressfuture_actions_log_format');
        }

        return $status;
    }

    public function enqueueScripts($screenId)
    {
        if ('future_page_publishpress-future-scheduled-actions' === $screenId) {
            wp_enqueue_style(
                'postexpirator-css',
                POSTEXPIRATOR_BASEURL . 'assets/css/style.css',
                false,
                POSTEXPIRATOR_VERSION
            );

            wp_enqueue_style(
                'pe-footer',
                POSTEXPIRATOR_BASEURL . 'assets/css/footer.css',
                false,
                POSTEXPIRATOR_VERSION
            );
        }
    }

    public function filterActionSchedulerAdminNotice($html, $action, $notification)
    {
        if ($action->get_group() !== 'publishpress-future') {
            return $html;
        }

        if ($action->get_hook() === 'publishpressfuture_run_workflow') {
            $args = $action->get_args();

            if (isset($args['postId']) && isset($args['workflow']) && 'expire' === $args['workflow']) {

                $transientName = 'post-expirator-notice-' . (int) $args['postId'];
                $noticeMessage = get_transient($transientName);
                delete_transient($transientName);

                // translators: %s is the action description
                $html = sprintf(
                    __('Successfully executed action: %s', 'post-expirator'),
                    $noticeMessage
                );
            }
        }

        return $html;
    }
}
