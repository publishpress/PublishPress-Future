<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use Closure;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class PluginsListController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param HookableInterface $hooksFacade
     */
    public function __construct(HookableInterface $hooksFacade)
    {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->hooks->addFilter(CoreHooksAbstract::FILTER_PLUGIN_ACTION_LINKS, [$this, 'addPluginActionLinks'], 10, 2);
    }

    public function addPluginActionLinks($links, $file)
    {
        $this_plugin = basename(PUBLISHPRESS_FUTURE_BASE_PATH) . '/post-expirator.php';
        if ($file === $this_plugin) {
            $links[] = '<a href="admin.php?page=publishpress-future">' . __('Settings', 'post-expirator') . '</a>';
        }

        return $links;
    }
}
