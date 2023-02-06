<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Core;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Framework\ModuleInterface as ModuleInterface;

class PluginInitializator implements InitializableInterface
{
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * @var ModuleInterface[]
     */
    private $controllers;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param ModuleInterface[] $controllers
     * @param HookableInterface $hooksFacade
     */
    public function __construct(
        array $controllers,
        HookableInterface $hooksFacade
    ) {
        $this->controllers = $controllers;
        $this->hooks = $hooksFacade;
    }

    public function initialize(): void
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);

        $this->initializeControllers();
    }

    private function initializeControllers(): void
    {
        foreach ($this->controllers as $controller) {
            if (method_exists($controller, 'initialize')) {
                $controller->initialize();
            }
        }
    }
}
