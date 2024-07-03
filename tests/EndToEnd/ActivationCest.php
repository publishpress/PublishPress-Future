<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function test_plugin_is_activated(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('publishpress-future-pro');
    }

    public function test_plugin_deactivates_activates_correctly(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('publishpress-future-pro');
        $I->deactivatePlugin('publishpress-future-pro');
        $I->seePluginDeactivated('publishpress-future-pro');
        $I->activatePlugin('publishpress-future-pro');
        $I->amOnPluginsPage();
        $I->seePluginActivated('publishpress-future-pro');
    }

    public function test_plugin_redirects_to_settings_after_activation(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->deactivatePlugin('publishpress-future-pro');
        $I->activatePlugin('publishpress-future-pro');
        $I->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future');
    }
}
