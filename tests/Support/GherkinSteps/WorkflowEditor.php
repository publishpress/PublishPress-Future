<?php

namespace Tests\Support\GherkinSteps;

trait WorkflowEditor
{
    use Post;

    /**
     * @When I go to the workflow editor page for creating a new workflow
     */
    public function iGoToTheWorkflowEditorPageForCreatingANewWorkflow()
    {
        $this->amOnAdminPage('edit.php?post_type=ppfuture_workflow');

        $persistentFeatures = [
            'persistentFeatures' => [
                'fullscreenMode' => true,
                'welcomeGuide' => false,
                'controls' => true,
                'developerMode' => false,
                'advancedSettings' => false,
                'miniMap' => false,
            ]
        ];
        $this->executeJS('window.localStorage.setItem("FUTURE_PRO_WORKFLOW_PREFERENCES_1", \'' . json_encode($persistentFeatures) . '\');');

        $this->amOnAdminPage('admin.php?page=future_workflow_editor');

        // Wait until events (like unselect all nodes) are executed
        $this->wait(0.7);

        // Wait until the placeholder node is visible
        $this->waitForElementVisible('.react-flow__node-triggerPlaceholderNode', 10);
    }

    /**
     * @When I go to the workflow editor page for editing the workflow :title
     */
    public function iGoToTheWorkflowEditorPageForEditingTheWorkflow($title)
    {
        $this->amOnAdminPage('edit.php?post_type=ppfuture_workflow');

        $this->click($title);

        // Wait for ay node to be visible
        $this->waitForElementVisible('.react-flow__node-label', 10);
    }

    /**
     * @When I fill in workflow title as :title
     */
    public function iFillInWorkflowTitle($title)
    {
        $this->fillField('.editor-post-title__panel input', $title);
        $this->seeInField('.editor-post-title__panel input', $title);
    }

    /**
     * @When I fill in workflow description as :description
     */
    public function iFillInWorkflowDescription($description)
    {
        $this->fillField('.editor-post-description__panel textarea', $description);
        $this->seeInField('.editor-post-description__panel textarea', $description);
    }

    /**
     * @Then I should see the message :message in the snackbar
     */
    public function iShouldSeeTheMessageInTheSnackbar($message)
    {
        $I = $this;

        $this->performOn('.components-snackbar', function () use ($I, $message) {
            $I->see($message);
        });
    }

    /**
     * @When I wait until I see the message :message in the snackbar
     */
    public function iWaitUntilISeeTheMessageInTheSnackbar($message)
    {
        $I = $this;

        $this->performOn('.components-snackbar', function () use ($I, $message) {
            $I->waitForText($message);
        });
    }

    /**
     * @Then I should see the screenshot for the workflow :title in the list of workflows
     */
    public function iShouldSeeTheScreenshotForTheWorkflowInTheListOfWorkflows($title)
    {
        $postId = $this->getPostIdFromLastPost();

        $this->amOnAdminPage('edit.php?post_type=ppfuture_workflow');
        $this->seeElement('#post-' . $postId . ' .future-pro-workflow-preview img');
    }

    /**
     * @Then I should see the screenshot for the workflow :title in the upload folder
     */
    public function iShouldSeeTheScreenshotForTheWorkflowInTheUploadFolder($title)
    {
        $postId = $this->getPostIdFromLastPost();
        $uploadsPath = $this->getUploadsPath() . '/publishpress-future/workflows';

        $this->seeFileFound('workflow-screenshot-' . $postId . '.png', $uploadsPath);

        // Get all files in the folder using php function
        $files = scandir($uploadsPath);

        // Check how many files are related to the workflow
        $workflowFiles = array_filter($files, function ($file) use ($postId) {
            return strpos($file, 'workflow-screenshot-' . $postId) !== false;
        });

        $this->assertCount(5, $workflowFiles);

        // Check if the files have names with the sizes
        foreach ($workflowFiles as $file) {
            // Ignore the file without dimensions
            if (strpos($file, 'workflow-screenshot-' . $postId . '.png') !== false) {
                continue;
            }

            $this->assertMatchesRegularExpression('/workflow-screenshot-' . $postId . '-\d+x\d+.png/', $file);
        }
    }
}
