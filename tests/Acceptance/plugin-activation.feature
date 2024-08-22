Feature: Plugin activation
  In order to use and configure the plugin
  As a site administrator
  I need to be able to activate the plugin

  Background:
    Given I am logged in as administrator

  Scenario: Plugin is active by default when test suite is run
    When I go to the plugins page
    Then I should see the plugin "publishpress-future-pro" is activated

  Scenario: Deactivate and activate the plugin
    When I go to the plugins page
      And I see the plugin "publishpress-future-pro" is activated
      And I deactivate the plugin "publishpress-future-pro"
      And I see the plugin "publishpress-future-pro" is deactivated
    When I activate the plugin "publishpress-future-pro"
     And I go to the plugins page
    Then I should see the plugin "publishpress-future-pro" is activated

  Scenario: Activating the plugin it redirects to the settings page
    When I go to the plugins page
      And I deactivate the plugin "publishpress-future-pro"
      And I see the plugin "publishpress-future-pro" is deactivated
    When I activate the plugin "publishpress-future-pro"
    Then I should be on the settings page for the plugin
