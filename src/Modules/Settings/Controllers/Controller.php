<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings\Controllers;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\HooksAbstract as CoreAbstractHooks;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Modules\Settings\HooksAbstract;
use PublishPressFuture\Modules\Settings\SettingsFacade;

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
            HooksAbstract::FILTER_DEBUG_ENABLED,
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

        $this->hooks->doAction(HooksAbstract::ACTION_DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }

    public function onFilterDebugEnabled($enabled = false)
    {
        return $this->settings->getDebugIsEnabled($enabled);
    }
}
