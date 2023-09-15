<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core;

use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface as ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;

defined('ABSPATH') or die('Direct access not allowed.');

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
     * @var object
     */
    private $legacyPlugin;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var string
     */
    private $basePath;

    /**
     * @var string
     */
    private $pluginSlug;

    /**
     * @var NoticeFacade
     */
    private $notices;

    /**
     * @param ModuleInterface[] $modules
     * @param object $legacyPlugin
     * @param HookableInterface $hooksFacade
     * @param string $pluginSlug
     * @param string $basePath
     * @param NoticeFacade $notices
     */
    public function __construct(
        $modules,
        $legacyPlugin,
        HookableInterface $hooksFacade,
        $pluginSlug,
        $basePath,
        NoticeFacade $notices
    ) {
        $this->modules = $modules;
        $this->legacyPlugin = $legacyPlugin;
        $this->hooks = $hooksFacade;
        $this->basePath = $basePath;
        $this->pluginSlug = $pluginSlug;
        $this->notices = $notices;
    }

    public function initialize()
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        $pluginDir = basename($this->basePath);
        load_plugin_textdomain('post-expirator', null, $pluginDir . '/languages/');

        \PostExpirator_Reviews::init();

        if (class_exists('WP_CLI')) {
            \PostExpirator_Cli::getInstance();
        }

        $this->hooks->addAction(HooksAbstract::ACTION_INSERT_POST, 'postexpirator_set_default_meta_for_post', 10, 3);
        $this->hooks->doAction(HooksAbstract::ACTION_INIT_PLUGIN);

        $pluginFile = $this->basePath . '/' . $this->pluginSlug . '.php';
        $this->hooks->registerActivationHook($pluginFile, [$this, 'activatePlugin']);
        $this->hooks->registerDeactivationHook($pluginFile, [$this, 'deactivatePlugin']);

        $this->notices->init();

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

    public function activatePlugin() {
        $this->hooks->doAction(HooksAbstract::ACTION_ACTIVATE_PLUGIN);
    }

    public function deactivatePlugin()
    {
        $this->hooks->doAction(HooksAbstract::ACTION_DEACTIVATE_PLUGIN);
    }
}
