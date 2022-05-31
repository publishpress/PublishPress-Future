<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Steps;

trait Plugins
{
    /**
     * @Given the plugin :plugin is active
     */
    public function pluginIsActive($plugin)
    {
        $this->pluginsAreActive([$plugin]);
    }

    /**
     * @Given the plugins :plugins are active
     */
    public function pluginsAreActive($plugins)
    {
        $plugins = explode(',', $plugins);

        $current   = get_option('active_plugins', []);
        foreach ($plugins as $plugin) {
            $current[] = $plugin . '/' . $plugin . '.php';
            sort($current);
        }

        update_option('active_plugins', $current);
    }
}
