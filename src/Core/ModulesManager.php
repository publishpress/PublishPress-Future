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
    public function initializeModules()
    {
        $this->hooks->doAction(ActionHooksAbstract::INIT_MODULES);

        array_walk($this->modulesInstanceList, [$this, 'initializeSingleModule']);
    }

    /**
     * @param InitializableInterface $module
     */
    public function initializeSingleModule($module)
    {
        if (is_object($module) && method_exists($module, 'initialize')) {
            $module->initialize();

            $this->hooks->doAction(ActionHooksAbstract::AFTER_INIT_MODULE, $module);
        }
    }
}
