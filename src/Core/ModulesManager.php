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
     * @param HookableInterface $hooks
     * @param array $modulesInstanceList
     */
    public function __construct(HookableInterface $hooks, $modulesInstanceList)
    {
        $this->hooks = $hooks;
        $this->modulesInstanceList = $modulesInstanceList;
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
