Feature: Do not expire posts if data is corrupted, in the Gutenberg editor
  In order to avoid expiring posts if data is corrupted
  As an admin
  I need to be able to see the post won't be expired in the Gutenberg editor

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"

  Scenario: _expiration-date-status=saved, but there is no expiring date
    Given post "post_1" exists
    And post "post_1" has metadata "_expiration-date-status" as "saved"
    When I am editing post "post_1"
    Then the checkbox Enable Post Expiration is deactivated on the component panel

  Scenario: _expiration-date-status=empty
    Given post "post_2" exists
    And post "post_2" has metadata "_expiration-date-status" as "0"
    When I am editing post "post_2"
    Then the checkbox Enable Post Expiration is deactivated on the component panel

