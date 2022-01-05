Feature: Expire post in the Gutenberg editor
  In order to expire a post
  As an admin
  I need to be able to configure a post to expire

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"

  Scenario: See the Gutenberg metabox
    Given post "post_1" exists
    And I am editing post "post_1"
    Then I see the component panel "PublishPress Future"
