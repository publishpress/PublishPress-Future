Feature: Settings - Tab Post Types
  In order to configure the default expiration values for post types
  As an admin
  I want to see and use the Post Types tab

  Background:
    Given the user "peter" exists with role "administrator"
    And I am logged in as "peter"
    And only the plugins "post-expirator, pre-tests" are active
    And I am on the settings page in the Post Types tab

  # POSTS
  @admin @settings
  Scenario Outline: Deactivate metabox for post type
    When I set Active field as inactive for <post_type>
    And I save the changes
    And I see the field Active has value inactive for <post_type>
    And I am adding a new post
    Then I don't see the component panel "Future"

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |

  @admin @settings
  Scenario Outline: Activate metabox for post type
    When I set Active field as active for <post_type>
    And I save the changes
    And I see the field Active has value active for <post_type>
    And I am adding a new post
    Then I see the component panel "Future"

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |
