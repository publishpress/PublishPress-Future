<?php

namespace Tests\EndToEnd;

use Tests\Support\EndToEndTester;

class ActivationCest
{
    public function test_it_deactivates_activates_correctly(EndToEndTester $I): void
    {
        $I->loginAsAdmin();
        $I->amOnPluginsPage();

        $I->seePluginActivated('publishpress-future-pro');

        $I->deactivatePlugin('publishpress-future-pro');

        $I->seePluginDeactivated('publishpress-future-pro');

        $I->activatePlugin('publishpress-future-pro');

        $I->seePluginActivated('publishpress-future-pro');
    }
}
