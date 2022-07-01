Feature: Settings - Tab Display
  In order to configure the display options
  As an admin
  I want to use the Display tab on the settings

  Background:
    Given the user "dammy" exists with role "administrator"
    And I am logged in as "dammy"
    And only the plugins "post-expirator, pre-tests" are active
    And I have option "permalink_structure" as "/%postname%/"
    And I am on the settings page in the Display tab

  Scenario: Show expiration date in post footer
    Given post "thepost" exists
    And post "thepost" is set to expire in seven days at noon as Draft
    When I enable Show in post footer
    And I fill Footer Contents with "Post expires at EXPIRATIONTIME on EXPIRATIONDATE"
    And I save the changes
    And I view the post "thepost"
    Then I see the expiration date in the post footer

  Scenario: Hide expiration date in post footer
    Given post "anotherpost" exists
    And post "anotherpost" is set to expire in seven days at noon as Draft
    When I disable Show in post footer
    And I fill Footer Contents with "Post expires at EXPIRATIONTIME on EXPIRATIONDATE"
    And I save the changes
    And I view the post "anotherpost"
    Then I don't see the expiration date in the post footer

  Scenario: Customize the post footer content
    Given post "crazypost" exists
    And post "crazypost" is set to expire in seven days at noon as Draft
    When I enable Show in post footer
    And I fill Footer Contents with "This post will expire! Hurry to read it!"
    And I save the changes
    And I view the post "crazypost"
    Then I see the custom footer content "This post will expire! Hurry to read it!"

  Scenario: Placeholder EXPIRATIONFULL is replaced on the post footer
    Given post "crazypost" exists
    And post "crazypost" is set to expire in seven days at noon as Draft
    When I enable Show in post footer
    And I fill Footer Contents with "This post will expire at EXPIRATIONFULL"
    And I save the changes
    And I view the post "crazypost"
    Then I see the custom footer content "This post will expire at"
    And I see the expiration full date in the footer content

  Scenario: Placeholder EXPIRATIONDATE is replaced on the post footer
    Given post "crazypost" exists
    And post "crazypost" is set to expire in seven days at noon as Draft
    When I enable Show in post footer
    And I fill Footer Contents with "This post will expire at EXPIRATIONDATE"
    And I save the changes
    And I view the post "crazypost"
    Then I see the custom footer content "This post will expire at"
    And I see the expiration date in the footer content

  @dev
  Scenario: Placeholder EXPIRATIONTIME is replaced on the post footer
    Given post "crazypost" exists
    And post "crazypost" is set to expire in seven days at noon as Draft
    When I enable Show in post footer
    And I fill Footer Contents with "This post will expire at EXPIRATIONTIME"
    And I save the changes
    And I view the post "crazypost"
    Then I see the custom footer content "This post will expire at"
    And I see the expiration time in the footer content
