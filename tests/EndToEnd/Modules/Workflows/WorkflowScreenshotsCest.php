<?php

namespace Tests\EndToEnd\Modules\Worflows;

use Tests\Support\EndToEndTester;

class WorkflowScreenshotsCest
{
    public function _before(EndToEndTester $I)
    {
        $I->resetWorkflows();
    }

    public function testScreenshotIsCreatedAfterWorkflowIsSaved(EndToEndTester $I)
    {
        $I->loginAsAdmin();

        $I->amOnAdminPage('edit.php?post_type=ppfuture_workflow');
        $I->amOnWorkflowEditorPage(0);
        $I->wait(0.2);
        $I->click('.react-flow__node-triggerPlaceholderNode');
        $I->click('Post is saved');
        $I->click('Save draft');
        $I->wait(1);
        $I->click('.edit-post-fullscreen-mode-close');
        $I->dontSee('No screenshot');

        $posts = $I->grabEntriesFromDatabase($I->grabPostsTableName(), ['post_type' => 'ppfuture_workflow']);
        $lastPost = end($posts);

        $I->seeFileFound('workflow-screenshot-' . $lastPost['ID'] . '.png', $I->getUploadsPath() . '/publishpress-future/workflows');
        $I->seeFileFound('workflow-screenshot-' . $lastPost['ID'] . '-150x150.png', $I->getUploadsPath() . '/publishpress-future/workflows');
        $I->seeFileFound('workflow-screenshot-' . $lastPost['ID'] . '-258x300.png', $I->getUploadsPath() . '/publishpress-future/workflows');
        $I->seeFileFound('workflow-screenshot-' . $lastPost['ID'] . '-768x892.png', $I->getUploadsPath() . '/publishpress-future/workflows');
        $I->seeFileFound('workflow-screenshot-' . $lastPost['ID'] . '-882x915.png', $I->getUploadsPath() . '/publishpress-future/workflows');
    }
}
