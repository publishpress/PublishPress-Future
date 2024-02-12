<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function test_it_deactivates_activates_correctly(EndToEndTester $I): void
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
