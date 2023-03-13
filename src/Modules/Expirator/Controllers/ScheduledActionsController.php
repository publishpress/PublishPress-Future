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
        add_submenu_page(
            'publishpress-future',
            __('Scheduled Actions', 'post-expirator'),
            __('Scheduled Actions', 'post-expirator'),
            'manage_options',
            'publishpress-future-scheduled-actions',
            [$this, 'renderScheduledActionsTemplate']
        );
    }

    public function renderScheduledActionsTemplate()
    {
        $context = [

        ];

        \PostExpirator_Display::getInstance()->render_template('scheduled-actions', $context);
    }
}
