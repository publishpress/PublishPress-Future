Feature: Expiring post in the Classic editor
  In order to control the post expiration of a post in the Classic Editor
  As an admin
  I need to be able to configure a post to expire or not using the metabox

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And the plugin "classic-editor" is active

  Scenario: When default expiration is not activated for post, the Enable Post Expiration checkbox should be unchecked by default for a new post
    Given default expiration is not activated for "post"
    When I am adding a new post
    Then the checkbox Enable Post Expiration is deactivated on the metabox

  Scenario: When default expiration is not activated for post, I can enable it for a new post
    Given default expiration is not activated for "post"
    When I am adding a new post with title "Post A"
    And I check the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is activated on the metabox

  Scenario: When default expiration is not activated for post, I can enable it for an existent post
    Given default expiration is not activated for "post"
    And post "post_2" exists
    And I am editing post "post_2"
    When I check the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is activated on the metabox

  Scenario: When default expiration is activated for post, the Enable Post Expiration checkbox should be checked by default for a new post
    Given default expiration is activated for "post"
    When I am adding a new post
    Then the checkbox Enable Post Expiration is activated on the metabox

  Scenario: When default expiration is activated for post, I can disable it for a new post
    Given default expiration is activated for "post"
    When I am adding a new post with title "Post B"
    When I uncheck the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is deactivated on the metabox

  Scenario: When default expiration is activated for post, I can disable it for an existent post
    Given default expiration is activated for "post"
    And post "post_4" exists
    And I am editing post "post_4"
    When I uncheck the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is deactivated on the metabox
