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
     * @var ModuleInterface[]
     */
    private $controllers;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $basePath;

    /**
     * @param ModuleInterface[] $controllers
     * @param HookableInterface $hooksFacade
     * @param string $basePath
     */
    public function __construct(
        array $controllers,
        HookableInterface $hooksFacade,
        string $basePath
    ) {
        $this->controllers = $controllers;
        $this->hooks = $hooksFacade;
        $this->basePath = $basePath;
    }

    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);

        $this->loadTextDomain();
        $this->initializeControllers();
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
