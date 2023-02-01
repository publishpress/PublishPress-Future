<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\HookableInterface;
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
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param ModuleInterface[] $modules
     * @param HookableInterface $hooksFacade
     */
    public function __construct(
        $modules,
        HookableInterface $hooksFacade
    ) {
        $this->modules = $modules;
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);

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
}
