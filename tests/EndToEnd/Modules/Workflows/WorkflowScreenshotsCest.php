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

        $posts = $I->grabEntriesFromDatabase($I->grabPostsTableName(), ['post_type' => 'ppfuture_workflow']);
        $lastPost = end($posts);
        $postId = $lastPost['ID'];
        $uploadsPath = $I->getUploadsPath() . '/publishpress-future/workflows';

        $I->seeFileFound('workflow-screenshot-' . $postId . '.png', $uploadsPath);
        $I->seeFileFound('workflow-screenshot-' . $postId . '-150x150.png', $uploadsPath);
        $I->seeFileFound('workflow-screenshot-' . $postId . '-258x300.png', $uploadsPath);
        $I->seeFileFound('workflow-screenshot-' . $postId . '-768x892.png', $uploadsPath);
        $I->seeFileFound('workflow-screenshot-' . $postId . '-882x915.png', $uploadsPath);

        $I->dontSee('No screenshot', '#post-' . $postId . ' .column-workflow_preview');
    }
}
