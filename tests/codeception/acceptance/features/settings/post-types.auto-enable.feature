Feature: Settings - Tab Post Types - Auto-Enable
  In order to automatically activate or deactivate for all posts of post type
  As an admin
  I want to be sure the Auto-Enable field is working

  Background:
    Given the user "mathew" exists with role "administrator"
    And I am logged in as "mathew"
    And only the plugins "post-expirator, pre-tests" are active
    And I am on the settings page in the Post Types tab

  @admin @settings
  Scenario Outline: Auto-enable field is saved if activated
    When I enable auto-enable for "<post_type>"
    And I save the changes
    Then I see auto-enable is selected for "<post_type>"

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |

  Scenario Outline: Auto-enable field is saved if deactivated
    When I disable auto-enable for "<post_type>"
    And I save the changes
    Then I see auto-enable is not selected for "<post_type>"

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |

  Scenario Outline: Auto-enable is enabled and post type expires by default
    Given post "genesis_1_1" exists
    When I enable auto-enable for "<post_type>"
    And I save the changes
    And I am adding a new "<post_type>" post
    Then the checkbox Enable Post Expiration is activated on the component panel

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |

  Scenario Outline: Auto-enable is disabled and post type do not expires by default
    Given post "exodus_20" exists
    When I disable auto-enable for "<post_type>"
    And I save the changes
    And I am adding a new "<post_type>" post
    Then the checkbox Enable Post Expiration is deactivated on the component panel

    Examples:
    | post_type |
    | post      |
    | page      |
    | music     |
