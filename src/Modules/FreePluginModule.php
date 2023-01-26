<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Modules;

use PublishPressFuture\Framework\ModuleInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;

class FreePluginModule implements ModuleInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var string
     */
    private $basePath;

    public function __construct(HooksFacade $hooks, $basePath)
    {
        $this->hooks = $hooks;
        $this->basePath = $basePath;
    }

    public function initialize()
    {
        $this->initializeFreePlugin();
    }

    private function initializeFreePlugin()
    {
        $pluginPath = null;
        if (
            defined('PUBLISHPRESS_FUTURE_BASE_PATH')
            && file_exists(PUBLISHPRESS_FUTURE_BASE_PATH . '/post-expirator.php')
        ) {
            $pluginPath = PUBLISHPRESS_FUTURE_BASE_PATH . '/post-expirator.php';
        }

        if (empty($pluginPath)) {
            $pluginPath = $this->basePath . '/vendor/publishpress/publishpress-future/post-expirator.php';
        }

        if (is_readable($pluginPath)) {
            include_once $pluginPath;
        }
    }
}
