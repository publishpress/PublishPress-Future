<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\ModuleInterface as ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\NoticeFacade;

use PublishPress\Future\Modules\Settings\SettingsFacade;

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

    /**
     * This method is static because it is called before the plugin is initialized.
     * @return void
     */
    public static function onActivate()
    {
        /**
         * Callbacks hooked to this action can't be defined in callbacks of other actions like
         * `plugins_loaded` or `init` because this hook will be executed before those actions.
         */
        do_action(HooksAbstract::ACTION_ACTIVATE_PLUGIN);

        SettingsFacade::setDefaultSettings();
    }

    public static function onDeactivate()
    {
        do_action(HooksAbstract::ACTION_DEACTIVATE_PLUGIN);
    }
}
