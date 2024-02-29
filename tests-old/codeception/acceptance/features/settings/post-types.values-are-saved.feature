Feature: Settings - Tab Post Types - Values are saved
  In order to activate and deactivate expiration metabox for post types
  As an admin
  I want to be sure the settings are saved

  Background:
    Given the user "jhonny" exists with role "administrator"
    And I am logged in as "jhonny"
    And only the plugins "post-expirator, pre-tests" are active
    And I am on the settings page in the Post Types tab

  @admin @settings
  Scenario Outline: Saving settings for different post types
    When I set Active field as inactive for <post_type>
    And I set How To Expire as "<how_to_expire>" for "<post_type>"
    And I set Auto-Enable as "<auto_enable>" for "<post_type>"
    And I set Taxonomy as "<taxonomy>" for "<post_type>"
    And I set Who to Notify as "<who_to_notify>" for "<post_type>"
    And I set Default Date as "<default_date>" for "<post_type>"
    And I save the changes
    Then I see the field Active has value inactive for <post_type>
    And I see the field How to Expire has value "<how_to_expire>" for "<post_type>"
    And I see the field Auto-Enable has value "<auto_enable>" for "<post_type>"
    And I see the field Taxonomy has value "<taxonomy>" for "<post_type>"
    And I see the field Who to Notify has value "<who_to_notify>" for "<post_type>"
    And I see the field Default Date has value "<default_date>" for "<post_type>"

    Examples:
    | post_type | active   | how_to_expire | auto_enable | taxonomy | who_to_notify    | default_date    |
    | post      | active   | delete        | Enable      | tax2     | dev1@example.com | Publish Time    |
    | post      | active   | trash         | Disable     | tax3     | dev2@example.com | Custom:+1 month |
    | post      | deactive | delete        | Enable      | tax2     | dev3@example.com | Publish Time    |
    | post      | deactive | trash         | Disable     | tax2     | dev4@example.com | Custom:+3 month |
    | page      | active   | delete        | Enable      | tax2     | dev1@example.com | Publish Time    |
    | page      | active   | trash         | Disable     | tax3     | dev2@example.com | Custom:+1 month |
    | page      | deactive | delete        | Enable      | tax2     | dev3@example.com | Publish Time    |
    | page      | deactive | trash         | Disable     | tax2     | dev4@example.com | Custom:+3 month |
    | music     | active   | delete        | Enable      | tax2     | dev1@example.com | Publish Time    |
    | music     | active   | trash         | Disable     | tax3     | dev2@example.com | Custom:+1 month |
    | music     | deactive | delete        | Enable      | tax2     | dev3@example.com | Publish Time    |
    | music     | deactive | trash         | Disable     | tax2     | dev4@example.com | Custom:+3 month |
