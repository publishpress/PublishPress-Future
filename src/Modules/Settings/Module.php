<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;


use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Settings\Controllers\Controller;

class Module implements ModuleInterface
{
    /**
     * @var Controller
     */
    private $controller;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SettingsFacade
     */
    private $settings;

    /**
     * @var \Closure
     */
    private $settingsPostTypesModelFactory;

    /**
     * @var \Closure
     */
    private $taxonomiesModelFactory;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;
    /**
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface
     */
    private $cron;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param \Closure $settingsPostTypesModelFactory
     * @param \Closure $taxonomiesModelFactory
     * @param \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel $actionsModel
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface $cron
     */
    public function __construct(
        HookableInterface $hooks,
        $settings,
        $settingsPostTypesModelFactory,
        $taxonomiesModelFactory,
        $actionsModel,
        CronInterface $cron
    )
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;
        $this->cron = $cron;

        $this->controller = $this->getController();
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $this->controller->initialize();
    }

    private function getController()
    {
        return new Controller(
            $this->hooks,
            $this->settings,
            $this->settingsPostTypesModelFactory,
            $this->taxonomiesModelFactory,
            $this->actionsModel,
            $this->cron
        );
    }
}
