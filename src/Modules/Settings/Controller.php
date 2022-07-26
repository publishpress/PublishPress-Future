<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\Hooks\ActionsAbstract as CoreHooksAbstract;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Modules\Settings\Hooks\ActionsAbstract;

class Controller implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SettingsFacade
     */
    private $settings;

    /**
     * @var array $defaultData
     */
    private $defaultData;

    /**
     * @param HookableInterface $hooks
     * @param SettingsFacade $options
     */
    public function __construct(HookableInterface $hooks, $options)
    {
        $this->hooks = $hooks;
        $this->settings = $options;
    }

    public function initialize()
    {
        $this->hooks->addAction(CoreHooksAbstract::ACTIVATE_PLUGIN, [$this, 'onActivatePlugin']);
        $this->hooks->addAction(CoreHooksAbstract::DEACTIVATE_PLUGIN, [$this, 'onDeactivatePlugin']);
    }

    public function onActivatePlugin()
    {
        $this->settings->setDefaultSettings();
    }

    public function onDeactivatePlugin()
    {
        if ($this->settings->getSettingPreserveData()) {
            return;
        }

        $this->hooks->doAction(ActionsAbstract::DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }
}
