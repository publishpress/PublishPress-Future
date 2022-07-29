<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core;

use PublishPressFuture\Core\Framework\InitializableInterface;
use PublishPressFuture\Core\Framework\ModuleInterface as ModuleInterface;
use PublishPressFuture\Core\Hooks\AbstractActionHooks;
use PublishPressFuture\Core\Hooks\HookableInterface;

class Plugin implements InitializableInterface
{
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
        $this->hooks->doAction(AbstractActionHooks::INIT_PLUGIN);

        $pluginFile = $this->basePath . '/' . $this->pluginSlug . '.php';
        $this->hooks->registerDeactivationHook($pluginFile, [$this, 'deactivatePlugin']);
    }

    public function deactivatePlugin()
    {
        $this->hooks->doAction(AbstractActionHooks::DEACTIVATE_PLUGIN);
    }
}
