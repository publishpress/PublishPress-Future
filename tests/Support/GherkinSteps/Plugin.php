<?php

namespace Tests\Support\GherkinSteps;

trait Plugin
{
    /**
     * @Then I show be on the settings page for the plugin
     */
    public function iShowBeOnTheSettingsPageForThePlugin()
    {
        $this->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future');
    }
}
