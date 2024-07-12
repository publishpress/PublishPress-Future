<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function test_plugin_is_activated(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('post-expirator');
    }

    public function test_plugin_deactivates_activates_correctly(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('post-expirator');
        $I->deactivatePlugin('post-expirator');
        $I->seePluginDeactivated('post-expirator');
        $I->activatePlugin('post-expirator');
        $I->amOnPluginsPage();
        $I->seePluginActivated('post-expirator');
    }

    public function test_plugin_redirects_to_settings_after_activation(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->deactivatePlugin('post-expirator');
        $I->activatePlugin('post-expirator');
        $I->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future');
    }
}
