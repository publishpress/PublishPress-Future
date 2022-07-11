Feature: Settings - Admin menu
  The admin menu should only be visible for priviledged users.

  @admin @settings
  Scenario: Administrator can see the admin menu "Future"
    Given the user "john" exists with role "administrator"
      And I am logged in as "john"
      And only the plugins "ray-future, post-expirator, pre-tests" are active
    When I am on the admin home page
    Then I see the admin menu Future on the sidebar

  @admin @settings
  Scenario: Subscriber can not see the admin menu "Future"
    Given the user "mark" exists with role "subscriber"
      And I am logged in as "mark"
      And only the plugins "post-expirator, pre-tests" are active
    When I am on the admin home page
    Then I don't see the admin menu Future on the sidebar
