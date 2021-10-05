Feature: Post edit author in the admin
  In order to edit the post author
  As an admin
  I need to be able to select one or more authors for a post

  Background:
    Given the user "pet_admin_user" exists with role "administrator"
    And I am logged in as "pet_admin_user"

  Scenario: Core post author field is not visible in the post edit page if the post type is activated
    Then is working
