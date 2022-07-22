<?php

namespace PublishPressFuture\Core;

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
     * @param ModularInterface
     * @param object
     */
    public function __construct(ModularInterface $modulesManager, $legacyPlugin, HookableInterface $hooksFacade)
    {
        $this->modulesManager = $modulesManager;
        $this->legacyPlugin = $legacyPlugin;
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_PLUGIN_INIT);

        $this->modulesManager->initializeModules();
    }
}
