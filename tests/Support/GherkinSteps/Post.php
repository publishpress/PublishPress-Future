<?php

namespace Tests\Support\GherkinSteps;

use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Module;

trait Post
{
    public function getPostIdFromLastPost()
    {
        $posts = $this->grabEntriesFromDatabase($this->grabPostsTableName(), ['post_type' => 'ppfuture_workflow']);
        $lastPost = end($posts);

        return $lastPost['ID'];
    }

    /**
     * @Given I have a post :arg1
     */
    public function iHaveAPost($arg1)
    {
        $postId = $this->havePostInDatabase([
            'post_title' => $arg1,
            'post_type' => 'post',
            'post_status' => 'draft',
            'post_date' => date('Y-m-d H:i:s', strtotime('+1 day')),
        ]);
    }

    /**
     * @When I go to the posts list page
     */
    public function iGoToThePostsListPage()
    {
        $this->amOnPage('/wp-admin/edit.php');
    }

    /**
     * @When I quick edit the post :arg1
     */
    public function iQuickEditThePost($arg1)
    {
        $this->moveMouseOver('#the-list tr', 5, 5);
        $this->click('#the-list tr .inline button');
    }

    /**
     * @When I check the Enable Future Action checkbox
     */
    public function iCheckTheCheckbox()
    {
        $this->click('.post-expirator-panel .future-action-enable-checkbox input[type="checkbox"]');
    }

   /**
    * @Then I don't see the Trigger Workflow action
    */
    public function iDontSeeTheAction()
    {
        $this->dontSeeElementInDOM('#publishpress-future-quick-edit .future-action-select-action select option[value="trigger-workflow"]');
    }

   /**
    * @Given I have a workflow :arg1 with the trigger to enable Future Actions box
    */
    public function iHaveAWorkflowWithTheTriggerToEnableFutureActionBox($arg1)
    {
        $postId = $this->havePostInDatabase([
            'post_title' => $arg1,
            'post_type' => Module::POST_TYPE_WORKFLOW,
            'post_status' => 'publish',
            'post_content' => '{"nodes":[{"id":"futureLegacyAction_irk09e4","type":"trigger","position":{"x":10,"y":-80},"data":{"name":"trigger\/future.legacy-action","elementaryType":"trigger","version":1,"slug":"futureLegacyAction1","settings":[]},"width":170,"height":84,"selected":true,"positionAbsolute":{"x":10,"y":-80},"dragging":false}],"edges":[],"viewport":{"x":345,"y":935.5,"zoom":2},"editorVersion":"3.4.4"}',
        ]);

        $this->havePostMetaInDatabase($postId, WorkflowModel::META_KEY_HAS_LEGACY_TRIGGER, 1);
    }

   /**
    * @Then I see the Trigger Workflow action
    */
    public function iSeeTheAction()
    {
        $this->seeElementInDOM('#publishpress-future-quick-edit .future-action-select-action select option[value="trigger-workflow"]');
    }

   /**
    * @Then I see the :arg1 workflow in the list of workflows
    */
    public function iSeeTheWorkflowInTheListOfWorkflows($arg1)
    {
        $this->selectOption('#publishpress-future-quick-edit .future-action-select-action select', ['text' => 'Trigger workflow']);
        $this->see($arg1, '#publishpress-future-quick-edit .future-action-workflow select');
    }
}
