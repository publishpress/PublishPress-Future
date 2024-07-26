<?php


namespace Tests\EndToEnd\Regression;

use Tests\Support\EndToEndTester;

class Issue876_ScreenshotsOutOfGalleryCest
{
    public function _before(EndToEndTester $I)
    {
        $I->resetWorkflows();
    }

    public function testLegacyScreenshotsAreMovedToNewDestinationAfterVisitingWorkflowsList(EndToEndTester $I)
    {
        $I->loginAsAdmin();

        $I->amOnAdminPage('edit.php?post_type=ppfuture_workflow');
        $I->wait(2);

        // Grab the ids of all workflows
        $posts = $I->grabEntriesFromDatabase($I->grabPostsTableName(), ['post_type' => 'ppfuture_workflow']);
        $workflowIds = array_column($posts, 'ID');

        // Check the posts do not have attachments
        foreach ($workflowIds as $workflowId) {
            $attachments = $I->grabEntriesFromDatabase($I->grabPostsTableName(), ['post_parent' => $workflowId, 'post_type' => 'attachment']);
            $I->assertEmpty($attachments, 'The workflow ' . $workflowId . ' has attachments');
        }

        // Check there is no media
        $I->amOnAdminPage('upload.php');
        $I->wait(1);
        $I->see('No media items found.', 'p.no-media');

        $I->amOnAdminPage('edit.php?post_type=ppfuture_workflow');

        // There are screenshots in the new location for each size
        $screenshotFiles = $I->grabFilesFromFolder($I->getUploadsPath() . '/publishpress-future/workflows');

        foreach ($workflowIds as $workflowId) {
            // Check the screenshots are in the new location
            $I->seeFileFound('workflow-screenshot-' . $workflowId . '.png', $I->getUploadsPath() . '/publishpress-future/workflows');

            // Count files with the workflow id
            $filesWithWorkflowId = array_filter($screenshotFiles, function ($file) use ($workflowId) {
                return strpos($file, 'workflow-screenshot-' . $workflowId) !== false;
            });

            // It is hard to check each thumbnail file because the dimensions may vary, so the
            // file name is not predictable. We can only check the number of files with the workflow id.
            $I->assertEquals(5, count($filesWithWorkflowId), 'There are not 5 files with the workflow id ' . $workflowId);
        }
    }
}
