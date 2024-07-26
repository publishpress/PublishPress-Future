<?php

namespace Tests\EndToEnd\Modules\Worflows;

use Tests\Support\EndToEndTester;

class WorkflowEditorCest
{
    public function _before(EndToEndTester $I)
    {
        $I->resetWorkflows();
    }

    public function testCreateWorkflowSavingAsDraft(EndToEndTester $I)
    {
        $I->loginAsAdmin();

        $I->amOnAdminPage('edit.php?post_type=ppfuture_workflow');
        $I->amOnWorkflowEditorPage(0);
        $I->wait(0.2);
        $I->fillField('.editor-post-title__panel input', 'Testing Workflow');
        $I->seeInField('.editor-post-title__panel input', 'Testing Workflow');
        $I->fillField('.editor-post-description__panel textarea', 'This is a test workflow');
        $I->seeInField('.editor-post-description__panel textarea', 'This is a test workflow');
        $I->click('.react-flow__node-triggerPlaceholderNode');
        $I->click('Post is saved');
        $I->click('Save draft');
        $I->see('Saving', '.editor-header__settings button');
        $I->wait(2);
        $I->see('Workflow saved as draft.');
        $I->wait(1);
        $I->amOnAdminPage('edit.php?post_type=ppfuture_workflow');
        $I->see('Testing Workflow', '.wp-list-table');
    }
}
