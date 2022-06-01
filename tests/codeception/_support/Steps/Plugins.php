<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Steps;

trait Plugins
{
    /**
     * @Given only the plugins :plugins are active
     */
    public function onlyFollowingPluginsAreActive($plugins)
    {
        $plugins = explode(',', $plugins);
        $plugins = array_map('trim', $plugins);

        $current = [];
        foreach ($plugins as $plugin) {
            $current[] = $plugin . '/' . $plugin . '.php';
        }

        sort($current);

        $this->haveOptionInDatabase('active_plugins', $current);
    }

    /**
     * @Given the plugins :plugins are active
     * @Given the plugin :plugins is active
     */
    public function pluginsAreActive($plugins)
    {
        $plugins = explode(',', $plugins);
        $plugins = array_map('trim', $plugins);

        $current   = get_option('active_plugins', []);
        foreach ($plugins as $plugin) {
            $current[] = $plugin . '/' . $plugin . '.php';
        }

        sort($current);

        $this->haveOptionInDatabase('active_plugins', $current);
    }

    /**
     * @Given the plugins :plugins are not active
     * @Given the plugin :plugin is not active
     */
    public function pluginsAreNotActive($plugins)
    {
        $plugins = explode(',', $plugins);
        $plugins = array_map('trim', $plugins);

        $current   = get_option('active_plugins', []);
        foreach ($plugins as $plugin) {
            $pluginFile = $plugin . '/' . $plugin . '.php';

            $key = array_search($pluginFile, $current);

            if (false !== $key) {
                unset($current[$key]);
            }
        }
        sort($current);

        $this->haveOptionInDatabase('active_plugins', $current);
    }
}
