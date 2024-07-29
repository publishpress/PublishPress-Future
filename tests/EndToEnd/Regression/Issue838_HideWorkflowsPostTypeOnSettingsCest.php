<?php


namespace Tests\EndToEnd\Regression;

use Tests\Support\EndToEndTester;

class Issue838_HideWorkflowsPostTypeOnSettingsCest
{
    public function testActionWorkflowsPostTypeIsNotListedOnSettings(EndToEndTester $I)
    {
        $I->loginAsAdmin();

        $I->amOnAdminPage('admin.php?page=publishpress-future');
        $I->see('Use the values below to set the default');
        $I->dontSee('Action Workflows', '#publishpress-future-settings-post-types fieldset legend');
    }
}
