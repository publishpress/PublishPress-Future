<?php

namespace PublishPressFuture\Module\Settings;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\WordPress\OptionsFacade;
use PublishPressFuture\Core\HookActionsAbstract as CoreHooksAbstract;
use PublishPressFuture\Core\ServicesAbstract;

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

        $this->hooks->doAction(ActionHooksAbstract::DELETE_ALL_SETTINGS);

        $this->settings->deleteAllSettings();
    }
}
