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
  Scenario: Deactivate metabox for Post
    When I set Active field as inactive for "Post"
    And I save the changes
    And I see the field Active has value inactive for "Post"
    And I am adding a new post
    Then I don't see the component panel "Future"

  @admin @settings
  Scenario: Activate metabox for Post
    When set Active field as active for "Post"
    And I save the changes
    And I see the field Active has value active for "Post"
    And I am adding a new post
    Then I see the component panel "Future"

  # PAGES
  @admin @settings
  Scenario: Deactivate metabox for Page
    When I set Active field as inactive for "Page"
    And I save the changes
    And I see the field Active has value inactive for "Page"
    And I am adding a new "page" post
    Then I don't see the component panel "Future"

  @admin @settings
  Scenario: Activate metabox for Page
    When set Active field as active for "Page"
    And I save the changes
    And I see the field Active has value active for "Page"
    And I am adding a new "page" post
    Then I see the component panel "Future"

  # MUSICS
  @admin @settings
  Scenario: Deactivate metabox for Music
    When I set Active field as inactive for "Music"
    And I save the changes
    And I see the field Active has value inactive for "Music"
    And I am adding a new "music" post
    Then I don't see the component panel "Future"

  @admin @settings
  Scenario: Activate metabox for Music
    When set Active field as active for "Music"
    And I save the changes
    And I see the field Active has value active for "Music"
    And I am adding a new "music" post
    Then I see the component panel "Future"
