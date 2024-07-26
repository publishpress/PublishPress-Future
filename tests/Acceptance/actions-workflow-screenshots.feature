Feature: Actions workflow screenshots
  In order to visually identify workflows
  As a site administrator
  I need to be able to see the workflow screenshots in the workflows list

  Background:
    Given I am logged in as administrator
      And all the workflows are deleted

  Scenario: Create a new action workflow and see the screenshot in the workflows list
    When I go to the workflow editor page for creating a new workflow
      And I fill in workflow title as "Workflow A"
      And I click "Save draft"
      And I wait until I see the message "Workflow saved as draft." in the snackbar
    Then I should see the workflow "Workflow A" in the list of workflows as "Draft"
      And I should see the screenshot for the workflow "Workflow A" in the list of workflows

  Scenario: Create a new action workflow and see the screenshots in the upload folder
    When I go to the workflow editor page for creating a new workflow
      And I fill in workflow title as "Workflow B"
      And I click "Save draft"
      And I wait until I see the message "Workflow saved as draft." in the snackbar
    Then I should see the workflow "Workflow B" in the list of workflows as "Draft"
      And I should see the screenshot for the workflow "Workflow B" in the upload folder
