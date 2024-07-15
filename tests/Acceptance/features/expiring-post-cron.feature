Feature: Expiring posts
  In order to control the future action of a post in the Gutenberg editor
  As an admin
  I need to be able to configure a post to expire or not, using the component panel

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests, disable-welcome-messages-and-tips" are active

  # @admin @gutenberg @dev
  # Scenario: New post expires if expiration date is in the past
  #   Given post "post" exists
  #   And I am editing post "post"
  #   And I check the Enable Future Action checkbox on Gutenberg
  #   And I set the expiration date to yesterday as draft on Gutenberg
  #   When I publish the post on Gutenberg
  #   And I run expiring cron for post "post"
  #   Then the post "post" expired as draft
