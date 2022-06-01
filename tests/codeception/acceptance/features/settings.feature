Feature: Settings
  In order to configure the plugin
  As an admin
  I need to be able to see and use the admin menu

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests" are active

  @admin @settings
  Scenario: See the Future admin menu
    When I am on the admin home page
    Then I see the Future admin menu on the sidebar

  @admin @settings
  Scenario: Change Post default expiration taxonomy
    Given I am on the settings page in the Post Types tab
    When I change the default taxonomy to "tax1" for "Post"
    And I save the changes
    Then I see the taxonomy "tax1" as the default one for "Post"
