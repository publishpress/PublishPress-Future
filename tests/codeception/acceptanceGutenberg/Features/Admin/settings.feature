Feature: Settings
  In order to configure the plugin
  As an admin
  I need to be able to see the submenu in the Settings menu

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"

  Scenario: See the Settings submenu
    Then I see the Settings submenu "Future"
