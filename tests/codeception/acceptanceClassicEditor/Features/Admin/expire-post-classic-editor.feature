Feature: Expire post in the Classic editor
  In order to expire a post
  As an admin
  I need to be able to configure a post to expire

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And the plugin "classic-editor" is active

  Scenario: See the metabox in the Classic Editor
    Given post "post_1" exists
    And I am editing post "post_1"
    Then I see the metabox "PublishPress Future"
