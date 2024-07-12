Feature: Do not mark post for expiring on Gutenberg if data is corrupted
  In order to avoid expiring posts when expiring data is corrupted
  As an admin
  I need to be able to see the post won't be expired

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests" are active

  @admin @gutenberg
  Scenario: Gutenberg: _expiration-date-status=saved, but there is no expiring date
    Given post "post_1" exists
    And post "post_1" has metadata "_expiration-date-status" as "saved"
    When I am editing post "post_1"
    Then the checkbox Enable Future Action is deactivated on the component panel

  @admin @gutenberg
  Scenario: Gutenberg: _expiration-date-status=empty
    Given post "post_2" exists
    And post "post_2" has metadata "_expiration-date-status" as "0"
    When I am editing post "post_2"
    Then the checkbox Enable Future Action is deactivated on the component panel
