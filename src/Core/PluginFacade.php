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
     * @param ModularInterface
     * @param object
     */
    public function __construct(ModularInterface $modulesManager, $legacyPlugin)
    {
        $this->modulesManager = $modulesManager;
        $this->legacyPlugin = $legacyPlugin;
    }

    public function initialize()
    {
        $this->modulesManager->initializeAllModules();
    }
}
