<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function testPluginIsActivated(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('publishpress-future-pro');
    }

    public function testPluginDeactivatesActivatesCorrectly(EndToEndTester $I): void
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

    public function testPluginRedirectsToSettingsAfterActivation(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->deactivatePlugin('publishpress-future-pro');
        $I->activatePlugin('publishpress-future-pro');
        $I->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future');
    }
}
