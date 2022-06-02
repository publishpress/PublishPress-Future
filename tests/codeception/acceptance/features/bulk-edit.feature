Feature: Bulk edit posts in the admin
  In order to edit multiple posts
  As an admin
  I need to be able to select and edit expiration for multiple posts

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"
    And only the plugins "post-expirator, pre-tests" are active

  @admin
  Scenario: See the field in the bulk edit panel
    Given posts "bef_post_a, bef_post_b, bef_post_c" exist
    When I am on the list of posts
    And I bulk edit the posts "bef_post_a, bef_post_b, bef_post_c"
    Then I see the fields to change post expiration on bulk edit panel

  @admin
  Scenario: Option to change on posts with no expiration do not change posts
    Given posts "bef_post_e, bef_post_f, bef_post_g" exist
    When I am on the list of posts
    And I bulk edit the posts "bef_post_e, bef_post_f, bef_post_g"
    And I set the expiration option to Change on posts
    And I set the day of expiration to tomorrow at noon
    And I click on Update
    Then I see the posts "bef_post_e, bef_post_f, bef_post_g" shows Never on the Expires column

  @admin
  Scenario: Option to change on posts with expiration changes the data
    Given posts "bef_post_h, bef_post_i, bef_post_j" exist
    And posts "bef_post_h, bef_post_i" are set to expire in seven days at noon as Draft
    When I am on the list of posts
    And I bulk edit the posts "bef_post_h, bef_post_i, bef_post_j"
    And I set the expiration option to Change on posts
    And I set the day of expiration to tomorrow at noon
    And I click on Update
    Then I see the posts "bef_post_h, bef_post_i" will expire tomorrow at noon
    And  I see the post "bef_post_j" shows Never on the Expires column

  @admin
  Scenario: Option to add to posts changes only posts with no expiration
    Given posts "bef_post_k, bef_post_l, bef_post_m" exist
    And posts "bef_post_k, bef_post_l" are set to expire in seven days at noon as Draft
    When I am on the list of posts
    And I bulk edit the posts "bef_post_k, bef_post_l, bef_post_m"
    And I set the expiration option to Add to posts
    And I set the day of expiration to tomorrow at noon
    And I click on Update
    Then I see the posts "bef_post_k, bef_post_l" will expire in seven days at noon
    And  I see the post "bef_post_m" will expire tomorrow at noon

  @admin
  Scenario: Option to change and add to posts changes all selected posts
    Given posts "bef_post_n, bef_post_o, bef_post_p" exist
    And posts "bef_post_n, bef_post_o" are set to expire in seven days at noon as Draft
    When I am on the list of posts
    And I bulk edit the posts "bef_post_n, bef_post_o, bef_post_p"
    And I set the expiration option to Change and Add to posts
    And I set the day of expiration to tomorrow at noon
    And I click on Update
    Then I see the posts "bef_post_n, bef_post_o, bef_post_p" will expire tomorrow at noon

  @admin
  Scenario: Option to remove from posts changes all selected posts
    Given posts "bef_post_q, bef_post_r, bef_post_s" exist
    And posts "bef_post_q, bef_post_r" are set to expire in seven days at noon as Draft
    When I am on the list of posts
    And I bulk edit the posts "bef_post_q, bef_post_r, bef_post_s"
    And I set the expiration option to Remove from posts
    And I click on Update
    Then I see the posts "bef_post_q, bef_post_r, bef_post_s" shows Never on the Expires column
