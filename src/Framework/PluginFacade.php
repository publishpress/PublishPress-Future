<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework;

use PublishPressFuture\Framework\Hooks\ActionsAbstract;

class PluginFacade implements InitializableInterface
{
    /**
     * @var ModularInterface
     */
    private $modulesManager;

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
     * @param ModularInterface $modulesManager
     * @param object $legacyPlugin
     * @param HookableInterface $hooksFacade
     * @param string $pluginSlug
     * @param string $basePath
     */
    public function __construct(
        ModularInterface $modulesManager,
        $legacyPlugin,
        HookableInterface $hooksFacade,
        $pluginSlug,
        $basePath
    ) {
        $this->modulesManager = $modulesManager;
        $this->legacyPlugin = $legacyPlugin;
        $this->hooks = $hooksFacade;
        $this->basePath = $basePath;
        $this->pluginSlug = $pluginSlug;
    }

    public function initialize()
    {
        $this->hooks->doAction(ActionsAbstract::INIT_PLUGIN);

        $pluginFile = $this->basePath . '/' . $this->pluginSlug . '.php';
        $this->hooks->registerDeactivationHook($pluginFile, [$this, 'deactivatePlugin']);

        $this->modulesManager->initializeModules();
    }

    public function deactivatePlugin()
    {
        $this->hooks->doAction(ActionsAbstract::DEACTIVATE_PLUGIN);
    }
}
