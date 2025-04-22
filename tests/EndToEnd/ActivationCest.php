<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function _before(EndToEndTester $I): void
    {
        $I->havePluginActivated();
        $I->loginAsAdmin();
    }

    public function testPluginActivatesCorrectly(EndToEndTester $I): void
    {
        $I->havePluginDeactivated();
        $I->amOnPluginsPage();
        $I->seePluginDeactivated('post-expirator');
        $I->activatePlugin('post-expirator');
        $I->wait(3);
        $I->amOnPluginsPage();
        $I->waitForElementVisible('tr[data-slug="post-expirator"]', 10);
        $I->seePluginActivated('post-expirator');
    }

    public function testPluginDeactivatesCorrectly(EndToEndTester $I): void
    {
        $I->amOnPluginsPage();
        $I->seePluginActivated('post-expirator');
        $I->deactivatePlugin('post-expirator');
        $I->wait(3);
        $I->amOnPluginsPage();
        $I->makeScreenshot('plugins-page');
        $I->waitForElementVisible('#bulk-action-selector-bottom', 10);
        $I->seePluginDeactivated('post-expirator');
    }

    public function testPluginRedirectsToSettingsAfterActivation(EndToEndTester $I): void
    {
        $I->havePluginDeactivated();
        $I->amOnPluginsPage();
        $I->seePluginDeactivated('post-expirator');
        $I->activatePlugin('post-expirator');
        $I->wait(3);
        $I->seeCurrentUrlEquals('/wp-admin/admin.php?page=publishpress-future-settings');
    }
}
