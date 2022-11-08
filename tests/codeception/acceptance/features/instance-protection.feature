Feature: Instance protection
  In order to protect the plugin from running multiple times
  As an admin
  I need to be able to see the warnings when running the plugin multiple times

  Background:
    Given the user "admin_user" exists with role "administrator"
    And I am logged in as "admin_user"

  @admin
  Scenario: I don't see a warning below the plugin if plugin is not duplicated
    Given only the plugins "post-expirator, pre-tests" are active
    And plugin "post-expirator-2" do not exists
    When I am on the plugins list
    Then I don't see the warning "This plugin is not installed in the standard folder"

  @admin
  Scenario: See a warning below the plugin if installed on a non standard folder
    Given only the plugins "post-expirator, pre-tests" are active
    And I have the plugin duplicated as "post-expirator-2"
    When I am on the plugins list
    Then I see the warning "This plugin is not installed in the standard folder. The current path is post-expirator-2/post-expirator.php but it is expected to be post-expirator/post-expirator.php"

  @admin
  Scenario: See a notice if the duplicated plugin is activated
    Given I have the plugin duplicated as "post-expirator-2"
    And only the plugins "post-expirator, pre-tests, post-expirator-2/post-expirator.php" are active
    When I am on the plugins list
    Then I see the notice "You have activated multiple instances of PublishPress Future. Please keep only one activated and remove the others."

  @admin
  Scenario: See a notice if the duplicated plugin is outdated
    Given plugin "post-expirator-2" do not exists
    And I have the plugin duplicated as "post-expirator-2"
    And the plugin "post-expirator-2/post-expirator.php" is outdated
    And only the plugins "post-expirator, pre-tests" are active
    When I am on the plugins list
    Then I see the warning "This plugin is outdated. You already have a more recent version installed. Please remove this version."
