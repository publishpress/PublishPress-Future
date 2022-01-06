Feature: Expiring post in the Classic editor
  In order to expire a post
  As an admin
  I need to be able to configure a post to expire

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And the plugin "classic-editor" is active

  Scenario: When default expiration is not activated for post, the Enable Post Expiration checkbox should be unchecked by default
    Given default expiration is not activated for "post"
    And post "post_1" exists
    When I am editing post "post_1"
    Then the checkbox Enable Post Expiration is deactivated on the metabox

  Scenario: When default expiration is activated for post, the Enable Post Expiration checkbox should be checked by default
    Given default expiration is activated for "post"
    And post "post_2" exists
    When I am editing post "post_2"
    Then the checkbox Enable Post Expiration is activated on the metabox

  Scenario: When default expiration is not activated for post, I can enable it for the post
    Given default expiration is not activated for "post"
    And post "post_3" exists
    And I am editing post "post_3"
    When I check the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is activated on the metabox

  Scenario: When default expiration is activated for post, I can disable it for the post
    Given default expiration is activated for "post"
    And post "post_4" exists
    And I am editing post "post_4"
    When I uncheck the Enable Post Expiration checkbox
    And I save the post
    Then the checkbox Enable Post Expiration is deactivated on the metabox
