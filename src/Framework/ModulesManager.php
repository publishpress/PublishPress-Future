<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework;


use PublishPressFuture\Framework\Hooks\ActionsAbstract;

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
        $this->hooks->doAction(ActionsAbstract::INIT_MODULES);

        array_walk($this->modulesInstanceList, [$this, 'initializeSingleModule']);
    }

    /**
     * @param InitializableInterface $module
     */
    public function initializeSingleModule($module)
    {
        if (is_object($module) && method_exists($module, 'initialize')) {
            $module->initialize();

            $this->hooks->doAction(ActionsAbstract::AFTER_INIT_MODULE, $module);
        }
    }
}
