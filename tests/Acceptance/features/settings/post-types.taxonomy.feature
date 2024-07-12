Feature: Settings - Tab Post Types - Taxonomy
  In order to configure the default expiration values for post types
  As an admin
  I want to see and use the Post Types tab

  Background:
    Given the user "philip" exists with role "administrator"
    And I am logged in as "philip"
    And only the plugins "post-expirator, pre-tests" are active
    And I am on the settings page in the Post Types tab

  @admin @settings
  Scenario Outline: Change default expiration taxonomy for post type
    When I change the default taxonomy to <taxonomy> for <post_type>
    And I save the changes
    Then I see the taxonomy <taxonomy> as the default one for <post_type>

    Examples:
    | post_type | taxonomy |
    | post      | tax1     |
    | page      | tax2     |
    | music     | tax3     |
