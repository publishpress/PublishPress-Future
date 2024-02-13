<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function testPluginDeactivateActivateCorrectly(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('post-expirator');

        $I->deactivatePlugin('post-expirator');

        $I->seePluginDeactivated('post-expirator');

        $I->activatePlugin('post-expirator');

        $I->seePluginActivated('post-expirator');
    }
}
