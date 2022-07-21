<?php

namespace PublishPressFuture\Core;


class ModulesManager implements ModularInterface
{

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $modulesInstanceList;

    /**
     * @var object
     */
    private $legacyPlugin;

    /**
     * @param HookableInterface $hooks
     * @param array $modulesInstanceList
     * @param object $legacyPluginFactory
     */
    public function __construct(HookableInterface $hooks, $modulesInstanceList, $legacyPlugin)
    {
        $this->hooks = $hooks;
        $this->modulesInstanceList = $modulesInstanceList;
        $this->legacyPlugin = $legacyPlugin;
    }

    /**
     * Run the method "init" in all the modules, if exists.
     *
     * @return void
     */
    public function initializeAllModules()
    {
        array_map([$this, 'initializeAModule'], $this->modulesInstanceList);
    }

    /**
     * @param InitializableInterface $module
     *
     * @return InitializableInterface
     */
    public function initializeAModule($module)
    {
        if (is_object($module) && method_exists($module, 'initialize')) {
            $module->initialize();
        }

        return $module;
    }
}
