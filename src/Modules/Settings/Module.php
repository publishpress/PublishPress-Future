<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;


use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\ModuleInterface;
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
     * @var callable
     */
    private $settingsPostTypesModelFactory;

    /**
     * @var callable
     */
    private $taxonomiesModelFactory;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param callable $settingsPostTypesModelFactory
     * @param callable $taxonomiesModelFactory
     * @param \PublishPressFuture\Modules\Expirator\Models\ExpirationActionsModel $actionsModel
     */
    public function __construct(HookableInterface $hooks, $settings, $settingsPostTypesModelFactory, $taxonomiesModelFactory, $actionsModel)
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;

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
            $this->actionsModel
        );
    }
}
