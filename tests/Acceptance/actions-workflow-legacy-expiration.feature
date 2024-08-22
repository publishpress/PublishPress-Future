Feature: Actions workflow legacy expiration
  In order to integrate with the legacy expiration feature
  As a site administrator
  I need to be able to trigger workflows based on future post expiration

  Background:
    Given I am logged in as administrator
      And all the workflows are deleted

  Scenario: I don't see the Trigger Workflow action when there is no compatible workflow
    Given I have a post "test-no-workflow"
    When I go to the posts list page
      And I quick edit the post "test-no-workflow"
      And I check the Enable Future Action checkbox
    Then I don't see the Trigger Workflow action

  Scenario: I see the Trigger Workflow action when there is a compatible workflow
    Given I have a post "test-workflow"
      And I have a workflow "Test Workflow" with the trigger to enable Future Actions box
    When I go to the posts list page
      And I quick edit the post "test-workflow"
      And I check the Enable Future Action checkbox
    Then I see the Trigger Workflow action
      And I see the "Test Workflow" workflow in the list of workflows
