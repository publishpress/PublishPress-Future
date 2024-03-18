<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\FuturePro\Core;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface as ModuleInterface;

defined('ABSPATH') or die('No direct script access allowed.');

class PluginInitializator implements InitializableInterface
{
    /**
     * @var bool
     */
    private $initialized = false;

    /**
     * @var InitializableInterface[]
     */
    private $controllers;

    /**
     * @var InitializableInterface[]
     */
    private $modules;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $basePath;

    /**
     * @param InitializableInterface[] $controllers
     * @param HookableInterface $hooksFacade
     * @param string $basePath
     */
    public function __construct(
        array $controllers,
        HookableInterface $hooksFacade,
        string $basePath,
        array $modules
    ) {
        $this->controllers = $controllers;
        $this->hooks = $hooksFacade;
        $this->basePath = $basePath;
        $this->modules = $modules;
    }

    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $this->loadTextDomain();
        $this->initializeModules();
        $this->initializeControllers();

        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);
    }

    private function initializeModules()
    {
        foreach ($this->modules as $module) {
            if ($module instanceof InitializableInterface) {
                $module->initialize();
            }
        }
    }

    private function initializeControllers()
    {
        foreach ($this->controllers as $controller) {
            if (method_exists($controller, 'initialize')) {
                $controller->initialize();
            }
        }
    }

    private function loadTextDomain()
    {
        $basename = basename($this->basePath);
        load_plugin_textdomain(
            'post-expirator',
            false,
            $basename . '/lib/vendor/publishpress/publishpress-future/languages/'
        );
        load_plugin_textdomain(
            'publishpress-future-pro',
            false,
            $basename . '/languages/'
        );
    }
}
