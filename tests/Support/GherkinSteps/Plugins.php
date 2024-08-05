<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Tests\Support\GherkinSteps;

trait Plugins
{
    private function activatePlugins($plugins, $deactivateOthers = false)
    {
        $plugins = explode(',', $plugins);
        $plugins = array_map('trim', $plugins);

        $current = $deactivateOthers ? [] : get_option('active_plugins', []);

        foreach ($plugins as $plugin) {
            $item = $plugin;

            if (substr_count($plugin, '/') === 0) {
                $item .= '/' . $plugin . '.php';
            }

            $current[] = $item;
        }

        sort($current);

        $this->haveOptionInDatabase('active_plugins', $current);
    }

    /**
     * @Given only the plugins :plugins are active
     */
    public function onlyFollowingPluginsAreActive($plugins)
    {
        $this->activatePlugins($plugins, true);
    }

    /**
     * @Given the plugins :plugins are active
     * @Given the plugin :plugins is active
     */
    public function pluginsAreActive($plugins)
    {
        $this->activatePlugins($plugins, false);
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

    /**
     * @When I am on the plugins list
     */
    public function iAmOnThePluginsList()
    {
        $this->amOnAdminPage('plugins.php');
    }

    /**
     * @Given I have the plugin duplicated as :pluginName
     */
    public function iHaveThePluginDuplicatedAs($pluginName)
    {
        if (file_exists(ABSPATH . '/wp-content/plugins/' . $pluginName)) {
            return;
        }

        $this->copyDir(
            ABSPATH . '/wp-content/plugins/post-expirator',
            ABSPATH . '/wp-content/plugins/' . $pluginName
        );
    }

    /**
     * @Given plugin :pluginName do not exists
     */
    public function pluginDoNotExists($pluginName)
    {
        if (file_exists(ABSPATH . '/wp-content/plugins/' . $pluginName)) {
            $this->deleteDir(ABSPATH . '/wp-content/plugins/' . $pluginName);
        }
    }

    /**
     * @Then I see the warning :arg1
     */
    public function iSeeTheWarning($arg1)
    {
        $this->see($arg1, '.multiple-instances-warning');
    }

    /**
     * @Then I don't see the warning :arg1
     */
    public function iDontSeeTheWarning($arg1)
    {
        $this->dontSee($arg1, '.multiple-instances-warning');
    }

    /**
     * @Then I see the notice :arg1
     */
    public function iSeeTheNotice($arg1)
    {
        $this->see($arg1, '.notice');
    }

    /**
     * @Given the plugin :pluginName is outdated
     */
    public function thePluginIsOutdated($pluginName)
    {
        $filePath = ABSPATH . 'wp-content/plugins/' . $pluginName;

        $fileContent = file_get_contents($filePath);
        $fileContent = preg_replace('/ \* Version: [a-z0-9\.\-]+/', ' * Version: 0.0.1', $fileContent);

        $this->writeToFile($filePath, $fileContent);
    }
}
