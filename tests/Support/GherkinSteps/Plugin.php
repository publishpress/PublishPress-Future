<?php

namespace Tests\Support\GherkinSteps;

trait Plugin
{
    /**
     * @Then I should be on the settings page for the plugin
     */
    public function iShouldBeOnTheSettingsPageForThePlugin()
    {
        $this->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future');
    }
}
