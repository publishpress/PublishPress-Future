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
    private $settingsPostTypesModeFactory;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param callable $settingsPostTypesModeFactory
     */
    public function __construct(HookableInterface $hooks, $settings, $settingsPostTypesModeFactory)
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModeFactory = $settingsPostTypesModeFactory;

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
            $this->settingsPostTypesModeFactory
        );
    }
}
