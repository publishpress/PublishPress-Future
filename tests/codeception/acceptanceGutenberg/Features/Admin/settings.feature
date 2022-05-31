Feature: Settings
  In order to configure the plugin
  As an admin
  I need to be able to see the admin menu

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And the plugins "post-expirator, pre-tests" are active

  Scenario: See the Future admin menu
    When I am on the admin home page
    Then I see the Future admin menu on the sidebar
