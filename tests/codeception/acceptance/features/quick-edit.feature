Feature: Quick edit posts in the admin
  In order to quickly edit a post expiration
  As an admin
  I need to be able to use the quick edit and change expiration for a post

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests" are active

  @admin
  Scenario: See the checkbox in the quick edit panel
    Given post "post_1" exists
    When I am on the list of posts
    And I click on the quick edit action for "post_1"
    Then I see the checkbox to enable post expiration
