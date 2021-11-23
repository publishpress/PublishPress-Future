Feature: Expire post in the Post edit page
  In order to expire a post
  As an admin
  I need to be able to configure a post to expire

  Background:
    Given the user "peep_admin_user" exists with role "administrator"
    And I am logged in as "peep_admin_user"

  Scenario: See the Gutenberbg metabox
    Given post "peep_post_1" exists
    And I am editing post "peep_post_1"
    Then I see the component panel "Post Expirator"
    And I see "Enable Post Expiration" in code
