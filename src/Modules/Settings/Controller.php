<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Core\Framework\InitializableInterface;
use PublishPressFuture\Core\Hooks\HookableInterface;
use PublishPressFuture\Modules\Settings\Hooks\ActionsAbstract;
use PublishPressFuture\Framework\Hooks\HooksActionsAbstract as CoreHooksAbstract;

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
