<?php

namespace Tests\Support\GherkinSteps;

trait PluginsPage
{
    /**
     * @When I go to the plugins page
     */
    public function iGoToThePluginsPage()
    {
        $this->amOnPluginsPage();
    }

    /**
     * @Then I should see the plugin :plugin is activated
     * @When I see the plugin :plugin is activated
     */
    public function iSeeThePluginIsActivated($plugin)
    {
        $this->seePluginActivated($plugin);
    }

    /**
     * @Then I should see the plugin :plugin is deactivated
     * @When I see the plugin :plugin is deactivated
     */
    public function iSeeThePluginIsDeactivated($plugin)
    {
        $this->seePluginDeactivated($plugin);
    }

    /**
     * @When I deactivate the plugin :plugin
     */
    public function iDeactivateThePlugin($plugin)
    {
        $this->deactivatePlugin($plugin);
    }

    /**
     * @When I activate the plugin :plugin
     */
    public function iActivateThePlugin($plugin)
    {
        $this->activatePlugin($plugin);
    }


}
