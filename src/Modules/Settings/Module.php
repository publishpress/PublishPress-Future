<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings;


use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Settings\Controllers\Controller;

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
     * @var \PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel
     */
    private $actionsModel;
    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface
     */
    private $cron;
    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $settings
     * @param \Closure $settingsPostTypesModelFactory
     * @param \Closure $taxonomiesModelFactory
     * @param \PublishPress\Future\Modules\Expirator\Models\ExpirationActionsModel $actionsModel
     * @param \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface $cron
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct(
        HookableInterface $hooks,
        $settings,
        $settingsPostTypesModelFactory,
        $taxonomiesModelFactory,
        $actionsModel,
        CronInterface $cron,
        OptionsFacade $options,
        \Closure $expirablePostModelFactory
    )
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
        $this->settingsPostTypesModelFactory = $settingsPostTypesModelFactory;
        $this->taxonomiesModelFactory = $taxonomiesModelFactory;
        $this->actionsModel = $actionsModel;
        $this->cron = $cron;
        $this->options = $options;
        $this->expirablePostModelFactory = $expirablePostModelFactory;

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
            $this->cron,
            $this->options,
            $this->expirablePostModelFactory
        );
    }
}
