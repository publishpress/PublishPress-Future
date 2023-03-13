<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Expirator\HooksAbstract;

class ScheduledActionsController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param HookableInterface $hooksFacade
     */
    public function __construct(
        HookableInterface $hooksFacade
    ) {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_ADMIN_MENU,
            [$this, 'onAdminMenu']
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
            __('Future Actions', 'post-expirator'),
            __('Future Actions', 'post-expirator'),
            'manage_options',
            'publishpress-future-scheduled-actions',
            [$this, 'renderScheduledActionsTemplate']
        );

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
        $context = [

        ];

        \PostExpirator_Display::getInstance()->render_template('scheduled-actions', $context);
    }
}