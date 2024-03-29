Feature: Expiring posts using the Classic editor
  In order to control the future action of a post in the Classic Editor
  As an admin
  I need to be able to configure a post to expire or not, using the metabox

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests, classic-editor" are active

  # When default expiration is not activated for post

  @admin @classic-editor
  Scenario: When default expiration is not activated for post, the Enable Future Action checkbox should be unchecked by default for a new post
    Given default expiration is not activated for "post"
    When I am adding a new post
    Then the checkbox Enable Future Action is deactivated on the metabox

  @admin @classic-editor
  Scenario: When default expiration is not activated for post, I can enable it for a new post
    Given default expiration is not activated for "post"
    When I am adding a new post with title "Post A"
    And I check the Enable Future Action checkbox
    And I set the day of expiration to tomorrow at noon on classic editor
    And I save the post
    Then the checkbox Enable Future Action is activated on the metabox

  @admin @classic-editor
  Scenario: When default expiration is not activated for post, I can enable it for an existent post
    Given default expiration is not activated for "post"
    And post "post_2" exists
    And I am editing post "post_2"
    When I check the Enable Future Action checkbox
    And I set the day of expiration to tomorrow at noon on classic editor
    And I save the post
    Then the checkbox Enable Future Action is activated on the metabox

  # When default expiration is activated for post

  @admin @classic-editor
  Scenario: When default expiration is activated for post, the Enable Future Action checkbox should be checked by default for a new post
    Given default expiration is activated for "post"
    When I am adding a new post
    Then the checkbox Enable Future Action is activated on the metabox

  @admin @classic-editor
  Scenario: When default expiration is activated for post, I can disable it for a new post
    Given default expiration is activated for "post"
    When I am adding a new post with title "Post B"
    When I uncheck the Enable Future Action checkbox
    And I save the post
    Then the checkbox Enable Future Action is deactivated on the metabox

  @admin @classic-editor
  Scenario: When default expiration is activated for post, I can disable it for an existent post
    Given default expiration is activated for "post"
    And post "post_4" exists
    And I am editing post "post_4"
    When I uncheck the Enable Future Action checkbox
    And I save the post
    Then the checkbox Enable Future Action is deactivated on the metabox
