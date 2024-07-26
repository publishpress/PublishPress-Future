Feature: Actions workflow editor
  In order to have action workflows running on a site
  As a site administrator
  I need to be able to configure and run action workflows

  Background:
    Given I am logged in as administrator
      And all the workflows are deleted

  Scenario: Create a new action workflow saving as draft
    When I go to the workflow editor page for creating a new workflow
      And I fill in workflow title as "Test Workflow"
      And I click "Save draft"
    Then I should see the message "Workflow saved as draft." in the snackbar
      And I should see the workflow "Test Workflow" in the list of workflows as "Draft"

  Scenario: Create a new action workflow saving as published
    When I go to the workflow editor page for creating a new workflow
      And I fill in workflow title as "Test Workflow for publishing"
      And I click "Publish"
    Then I should see the message "Workflow published." in the snackbar
      And I should see the workflow "Test Workflow for publishing" in the list of workflows as "Published"

  Scenario: Edit an existing action workflow
    When I go to the workflow editor page for creating a new workflow
      And I fill in workflow title as "Workflow A"
      And I click "Save draft"
      And I wait until I see the message "Workflow saved as draft." in the snackbar
    When I go to the workflow editor page for editing the workflow "Workflow A"
      And I make screenshot "workflow-editor"
      And I fill in workflow title as "Workflow A edited"
      And I click "Save draft"
      And I wait until I see the message "Workflow saved as draft." in the snackbar
    Then I should see the workflow "Workflow A edited" in the list of workflows
