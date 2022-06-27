Feature: Settings - Tab Post Types
  In order to configure the default expiration values for post types
  As an admin
  I want to see and use the Post Types tab

  Background:
    Given the user "peter" exists with role "administrator"
    And I am logged in as "peter"
    And only the plugins "post-expirator, pre-tests" are active
    And I am on the settings page in the Post Types tab

  @admin @settings
  Scenario: Change default expiration taxonomy for Posts
    When I change the default taxonomy to "tax1" for "Post"
    And I save the changes
    Then I see the taxonomy "tax1" as the default one for "Post"

  @admin @settings
  Scenario: Change default expiration taxonomy for Pages
    When I change the default taxonomy to "tax2" for "Page"
    And I save the changes
    Then I see the taxonomy "tax2" as the default one for "Page"

  @admin @settings
  Scenario: Change default expiration taxonomy for custom type Music
    When I change the default taxonomy to "tax3" for "Music"
    And I save the changes
    Then I see the taxonomy "tax3" as the default one for "Music"

