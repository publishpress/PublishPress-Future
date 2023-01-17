<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core;

use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Framework\ModuleInterface as ModuleInterface;

class Plugin implements InitializableInterface
{
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * @var ModuleInterface[]
     */
    private $modules;

    /**
     * @var object
     */
    private $legacyPlugin;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $basePath;

    /**
     * @var string
     */
    private $pluginSlug;

    /**
     * @param ModuleInterface[] $modules
     * @param object $legacyPlugin
     * @param HookableInterface $hooksFacade
     * @param string $pluginSlug
     * @param string $basePath
     */
    public function __construct(
        $modules,
        $legacyPlugin,
        HookableInterface $hooksFacade,
        $pluginSlug,
        $basePath
    ) {
        $this->modules = $modules;
        $this->legacyPlugin = $legacyPlugin;
        $this->hooks = $hooksFacade;
        $this->basePath = $basePath;
        $this->pluginSlug = $pluginSlug;
    }

    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);

        $pluginFile = $this->basePath . '/' . $this->pluginSlug . '.php';
        $this->hooks->registerDeactivationHook($pluginFile, [$this, 'deactivatePlugin']);

        $this->initializeModules();
    }

    private function initializeModules()
    {
        foreach ($this->modules as $module) {
            if (method_exists($module, 'initialize')) {
                $module->initialize();
            }
        }
    }

    public function deactivatePlugin()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_DEACTIVATE_PLUGIN);
    }
}
