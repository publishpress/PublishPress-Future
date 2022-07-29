<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Core\AbstractHooks as CoreAbstractHooks;
use PublishPressFuture\Core\Framework\InitializableInterface;
use PublishPressFuture\Core\HookableInterface;

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
     * @param SettingsFacade $settings
     */
    public function __construct(HookableInterface $hooks, $settings)
    {
        $this->hooks = $hooks;
        $this->settings = $settings;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_ACTIVATE_PLUGIN,
            [$this, 'onActionActivatePlugin']
        );
        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onActionDeactivatePlugin']
        );
        $this->hooks->addFilter(
            AbstractHooks::FILTER_DEBUG_ENABLED,
            [$this, 'onFilterDebugEnabled']
        );
    }

    public function onActionActivatePlugin()
    {
        $this->settings->setDefaultSettings();
    }

    public function onActionDeactivatePlugin()
    {
        if ($this->settings->getSettingPreserveData()) {
            return;
        }

        $this->hooks->doAction(AbstractHooks::ACTION_DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }

    public function onFilterDebugEnabled($enabled = false)
    {
        return $this->settings->getDebugIsEnabled($enabled);
    }
}
