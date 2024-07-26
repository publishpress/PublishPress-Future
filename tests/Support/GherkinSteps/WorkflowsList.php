<?php

namespace Tests\Support\GherkinSteps;

trait WorkflowsList
{
    /**
     * @Then I should see the workflow :title in the list of workflows as :status
     */
    public function iShouldSeeTheWorkflowInTheListOfWorkflowsAs($title, $status)
    {
        // Check the workflow in the list
        $this->amOnAdminPage('edit.php?post_type=ppfuture_workflow');

        if ($status === 'Draft') {
            $this->see($title . ' — Draft', '.wp-list-table .column-title');
        } elseif ($status === 'Published') {
            $this->see($title, '.wp-list-table .column-title');
            $this->dontSee($title . ' — Draft', '.wp-list-table .column-title');
        }
    }

    /**
     * @Then I should see the workflow :title in the list of workflows
     */
    public function iShouldSeeTheWorkflowInTheListOfWorkflows($title)
    {
        // Check the workflow in the list
        $this->amOnAdminPage('edit.php?post_type=ppfuture_workflow');

        $this->see($title, '.wp-list-table .column-title');
    }
}
