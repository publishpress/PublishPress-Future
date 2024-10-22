=== PublishPress Future Pro: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins, rozroz
Author: publishpress
Author URI: https://publishpress.com
Tags: expire, posts, pages, schedule
Requires at least: 6.5
Requires PHP: 7.2.5
License: GPLv2 or later
Tested up to: 6.5
Stable tag: 4.0.1

Add an expiration date to posts. When your post is automatically unpublished, you can delete the post, change the status, or update the post categories.

== Description ==

The PublishPress Future plugin allows you to add an expiration date to posts. pages and other content type. When your post is automatically unpublished, you can delete the post, change the status, or update the post categories.

Here's an overview of what you can do with PublishPress Future:

* Choose expiry dates for content in any post type.
* Select expiry dates in the right sidebar when editing posts.
* Modify, remove or completely delete content when the expiry date arrives.
* Modify expiry dates using "Quick Edit" and "Bulk Edit".
* Receive email notifications when your content expires.
* Show expiry dates in your content, automatically or with shortcodes.

## Options for Expiring Posts

When your posts expire, you can perform these changes on your content:

* Change the status to "Draft".
* Delete the post.
* Send the post to the Trash.
* Change the status to "Private".
* Enable the “Stick to the top of the blog” option.
* Disable the “Stick to the top of the blog” option.
* Remove all existing categories, and add new categories.
* Keep all existing categories, and add new categories.
* Keep all existing categories, except for those specified in this change.

[Click here for more details on expiring posts](https://publishpress.com/knowledge-base/ways-to-expire-posts/).

## Display the Expiry Date in Your Content

PublishPress Future allows you to place automatically show the expiry date inside your articles. The expiry will be added at the bottom of your post.

[Click here to see the Footer Display options](https://publishpress.com/knowledge-base/footer-display/).

You can use shortcodes to show the expiration date inside your posts. You can customize the shortcode output with several formatting options.

[Click here to see the shortcode options](https://publishpress.com/knowledge-base/shortcodes-to-show-expiration-date/).

## Expiry Defaults for Post Types

PublishPress Future can support any post type in WordPress. Go to Settings > PublishPress Future > Defaults and you can choose default expiry options for each post type.

[Click here to see the default options](https://publishpress.com/knowledge-base/defaults-for-post-types/).

## PublishPress Future Email Notifications

The PublishPress Future plugin can send you email notifications when your content is unpublished. You can control the emails by going to Settings > PublishPress Future > General Settings.

[Click here to see the notification options](https://publishpress.com/knowledge-base/email-notifications/).

## Details on How Post Expiry Works

For each expiration event, a custom cron job is scheduled. This can help reduce server overhead for busy sites. This plugin REQUIRES that WP-CRON is setup and functional on your webhost.  Some hosts do not support this, so please check and confirm if you run into issues using the plugin.

[Click here to see the technical details for this plugin](https://publishpress.com/knowledge-base/scheduling-cron-jobs/).

== Installation ==

This section describes how to install the plugin and get it working.

1. Unzip the plugin contents to the `/wp-content/plugins/post-expirator/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Screenshots ==

1. Adding expiration date to a post
2. Viewing the expiration dates on the post overview screen
3. Settings screen

== Changelog ==

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
A full changelog is available in the plugin's GitHub repository.

## [4.0.3] - 22 Oct, 2024

### Changed

- Add the banner notice to the workflows list screen.

### Fixed

- Fix PHP warning when post attribute is empty in the workflow model (Issue #987, #988).
- Fix error when`manage_posts_columns` filter do not receive a post type (Issue #990).
- Fix error about undefined index: date (Issue #991).

## [4.0.2] - 21 Oct, 2024

### Fixed

- Fix error when the filter `the_title` is called without an ID (Issue #984).

## [4.0.1] - 21 Oct, 2024

### Fixed

- Fix the database schema check for version 4.0.0 on fresh installations, (Issue #928).

## [4.0.0] - 21 Oct, 2024

### Added

- New workflow trigger "On Cron Schedule" for running workflows on a specific date and interval (Issue #914).
- New inline workflow actions to activate and deactivate workflows, in the workflow list table (Issues #921, #920).
- New setting field in the Schedule step to allow setting a custom Unique UID Expression (Issue #921).
- New plugin's advanced setting to allow compressing the scheduled workflow data in the database (Commit f3ee2e6).
- New automatically scheduled action to clean up the scheduled actions arguments table (Commit f3ee2e6).
- New custom table `ppfuture_workflow_scheduled_steps` to store the arguments of the scheduled steps (Commit f3ee2e6).
- New Conditional Split step to allow splitting the workflow execution based on a condition.

### Changed

- The list of scheduled actions now displays the repetition count/date limits (Issue #928).
- Update language files.
- Updated the UI in the advanced settings page.
- Move some advanced settings to the "Display" tab (Issue #952)
- Add title to the future action panel for UI consistency (Issue #965)
- Renamed the PublishPress Future metabox to Future Actions for UI consistency (Issue #965)
- Arguments of scheduled workflow steps are now stored in a custom table `ppfuture_workflow_scheduled_steps` (Pro Commit f3ee2e6).
- The advanced settings to enable experimental features was changed from checkbox to radio buttons (Pro Commit f3ee2e6).
- Changed the title of scheduled actions, replacing "action" with "step" (Pro Commit 40e2706).
- New information added to the Recurrence column in the Scheduled Actions list table related to the limit of recurrences (Issue #928).
- If a workflow is updated after tasks are scheduled, the changes in the routine tree are applied to the scheduled tasks (Issue #927).
- When a workflow is published, there is a delay of a few seconds until cron actions are scheduled.

### Fixed

- Update post model to update post date when setting post status to publish.
- Prevent error when the current_post->ID is empty for unknown reasons, usually related to 3rd party plugins.
- Fix an issue where the default schedule for "As soon as possible" was not set correctly (PRO PR #51).
- Fix infinity loop in the workflow engine when using a post based trigger firing actions that update the post (Issue #922).
- Fix an issue in the posts list detecting scheduled steps arguments when the length of the arguments is lower than 191 characters, for manually enabled workflow for posts (Pro Commit f3ee2e6).
- When a workflow is unpublished, all the currently scheduled steps are canceled (Pro Commit f3ee2e6).
- Fix issue related to not be able to schedule actions from different workflows (Issue #921).
- Fix scheduled actions for exeecuting them when set to run "As soon as possible" (Issue #913).

### Developers

- ADDED: New node runner processor for cron based steps runners, `CronStep` (Pro Commit 7ea77bd).
- ADDED: New interfaces:
  - `...Modules\Workflows\Interfaces\AsyncNodeRunnerInterface` (Pro Commit 7ea77bd)
  - `...Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface` (Pro Commit 7ea77bd)
- ADDED: Tests for the `CoreSchedule` action runner (Pro Commit 7ea77bd).
- ADDED: New filter: `publishpressfuturepro_ignore_save_post_event` (Pro Commit 50eacab).
- ADDED: New filter `publishpressfuture_migrations` (Pro Commit 210953a).
- ADDED: New action `publishpressfuture_fix_db_schema` (Pro Commit 210953a).
- ADDED: New filter `publishpressfuture_schema_is_healthy` (Pro Commit 210953a).
- ADDED: New action `publishpressfuture_upgrade_plugin` (Pro Commit 210953a).
- ADDED: New controller `PublishPress\FuturePro\Modules\Workflows\Controllers\Migrations` (Pro Commit f3ee2e6).
- ADDED: New action `publishpressfuturepro_migrate_steps_scheduler_args_schema` (Pro Commit f3ee2e6).
- ADDED: New action `publishpressfuturepro_cleanup_orphan_workflow_args` (Pro Commit f3ee2e6).
- ADDED: New filter `publishpressfuturepro_orphan_workflow_args_cleanup_interval` (Pro Commit f3ee2e6).
- ADDED: New interface `PublishPress\FuturePro\Modules\Workflows\Interfaces\ScheduledActionModelInterface` (Pro Commit f3ee2e6).
- ADDED: New class `PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionModel` (Pro Commit f3ee2e6).
- ADDED: Tests for the new db table schema `WorkflowScheduledStepsSchema` (Pro Commit f3ee2e6).
- ADDED: New filter `publishpressfuturepro_cron_schedule_runner_transient_timeout` to allow filtering the transient timeout for the cron schedule runner.
- CHANGED: React component data field DateOffset now receives field settings as a prop and supports `settings.hideDateSources` (Pro Commit 7ea77bd).
- CHANGED: Renamed classes on namespace `PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerProcessors`:
  - `GeneralAction` to `GeneralStep` (Pro Commit 7ea77bd)
  - `PostAction` to `PostStep` (Pro Commit 7ea77bd)
- CHANGED: Updated `PublishPress\Future\Core\HookableInterface` with new methods: `removeFilter` and `removeAction` (Pro Commit 50eacab).
- CHANGED: Updated `PublishPress\Future\Framework\WordPress\Facade\HooksFacade` with new methods (Pro Commit 50eacab).
- CHANGED: Updated `PublishPress\Future\Framework\WordPress\Models\PostModel` with new `publish` method (Pro Commit 50eacab).
- CHANGED: The controller `PublishPress\FuturePro\Modules\Workflows\Controllers\ScheduledActions` now receives a cron interface in the constructor (Pro Commit f3ee2e6).
- CHANGED: Fixed data type of return value for `scheduleRecurringAction` and `scheduleAsyncAction` methods in `CronInterface` (Pro Commit 53c5e17).
- CHANGED: The variable resolver `PostResolver` now returns the post ID if no property is passed to `getValue` method (Pro Commit f3ee2e6).
- CHANGED: The variable resolver `SiteResolver` now returns the site name if no property is passed to `getValue` method (Pro Commit f3ee2e6).
- CHANGED: The variable resolver `UserResolver` now returns the user ID if no property is passed to `getValue` method (Pro Commit f3ee2e6).
- CHANGED: The interface `PublishPress\FuturePro\Modules\Workflows\Interfaces\ScheduledActionsModelInterface` was refactored to handle multiple schedules. To handle one schedule, use new interface `PublishPress\FuturePro\Modules\Workflows\Interfaces\ScheduledActionModelInterface` (Pro Commit f3ee2e6).
- CHANGED: The class `PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionsModel` was refactored to handle multiple schedules. To handle one schedule, use new class `PublishPress\FuturePro\Modules\Workflows\Models\ScheduledActionModel` (Pro Commit f3ee2e6).
- Interface `PublishPress\Future\Core\HookableInterface`: Add new method `removeFilter` to remove a hooked filter.
- Interface `PublishPress\Future\Core\HookableInterface`: Add new method `removeAction` to remove a hooked action.
- Class `PublishPress\Future\Framework\WordPress\Facade\HooksFacade`: Add new method `removeFilter` to remove a hooked filter.
- Class `PublishPress\Future\Framework\WordPress\Facade\HooksFacade`: Add new method `removeAction` to remove a hooked action.
- New method to publish posts using the class PublishPress\Future\Framework\WordPress\Models\PostModel.
- Add new filter 'publishpressfuture_migrations' to filter the list of migrations that will be executed.
- Call the action 'publishpressfuture_fix_db_schema' when a DB fix is executed from the settings page.
- Call the action 'publishpressfuture_upgrade_plugin' when the plugin is upgraded.
- Change the data type from void to int for the method 'PublishPress\Future\Modules\Expirator\Interfaces\CronInterfac::scheduleRecurringAction'.
- Change the data type from void to int for the method 'PublishPress\Future\Modules\Expirator\Interfaces\CronInterfac::scheduleAsyncAction'.
- Add new filter 'publishpressfuture_schema_is_healthy' to check if the DB schema is healthy.
- The method 'PublishPress\Future\Modules\Workflows\Models\WorkflowModel::getStepFromRoutineTreeRecursively' now always returns an array.
- Add new filter 'action_scheduler_list_table_column_recurrence' to filter the recurrence column in the scheduled actions list.
- Add new method 'getNodeById' to the class 'PublishPress\Future\Modules\Workflows\Models\WorkflowModel'.

## [3.4.4] - 22 Aug, 2024

### Fixed

- Improve notice message when scheduled action runs after pressing "run" (PR #896).
- Fixed support for the Event Espresso plugin (PR #900).
- Fixed React warning about createRoot being deprecated.
- Fixed empty fieldset displayed when the bos is disabled for the post type (Issue #792).
- Update language files.
- Fixed support for the WPForms' Post Submission addon (PRO PR #48).
- Fixed duplicated action workflow panels (PRO PR #49).
- Fixed workflow and future action checkboxes allowing to disable the future action checkbox (PRO PR #44).
- Fixed the Trigger Workflow legacy action to not be displayed if no workflows are available (Issue #910).

### Changed

- Add tabs for post types in the post types settings page (PR #895).

### Added

- Added computed date preview to the general settings page (PR #897).
- Added option to hide the calendar by default in the future action panel (PR #899).
- Added new filter `publishpressfuture_posts_future_action_column_output` to the Future Action column.
- Added date preview to the Date Offset setting field on workflows (PRO PR #47).
- Added new workflow step "Deactivate Workflow for Post".

## [3.4.3] - 06 Aug, 2024

### Added

- Add new date source for using the current step running time, #39
- Add notice when auto layout starts, #41
- Add option to enable experimental features in the settings (requires a constant to be defined)
- Improve debugging by adding support to send queries, emails, and errors to Ray after the trigger is called

### Changed

- Removed icon from the "PublishPress Future" metabox in the block editor, #821
- Changed the title of the "Workflow Manual Trigger" metabox to "Action Workflows", #821
- Remove workflow screenshots from post attachments, #42

### Fixed

- Categories sometimes appears as number in the workflow editor, #789
- Custom code to move posts to a custom status do not work using legacy expireType, #877
- Fix legacy expireType param values for custom statuses when using custom code to schedule actions, #38
- Unselect any previously selected steps in the workflow editor when loading a workflow
- Fix the source of the date used in the Schedule step by utilizing the value stored in the global variables. This enhancement enables referencing the original trigger date, #39
- Remove the workflow post type from the Post Types settings tab, #838
- Update translation files
- Only load the quick-edit script if in the post list screen
- Fix quick edit action box to use the filter to hide action box when deactivated for the post type, #884
- Fixed the database schema check to also check the debug log table, #887
- Fixed the database schema check to check the table indexes, #887

## [3.4.2] - 15 Jul, 2024

### Added

- Add the current date and time to date preview in the date/time offset setting field, #840
- Add new tips to the inserter in the workflow editor
- Add double-click behavior to the steps in a workflow to load the settings sidebar

### Fixed

- Fix the UserResolver to accept empty user when a user is not logged in, #832
- Remove deprecated constant FILTER_SANITIZE_STRING
- Optimized the date/time offset validation requests in the Post Types settings, #840
- Fix error message in the date/time offset setting field, #841
- Fix translations for ES, FR, and IT, #699, #859
- Fix user capabilities check in the block editor, #727
- Fix error when selecting Query Posts step in the workflow editor and Advanced Settings is not enabled, #850
- Fix inserter and sidebar in the workflow editor, ensuring they are not visible at the same time, #740
- Fix the vertical size of the inserter and scroll on small screens, #740
- Fix the scroll position in the settings sidebar when it opens, #855
- Fix step description for the Future Actions trigger, #31
- Fix the workflow editor layout for WordPress 6.6, #863

## [3.4.1] - 26 Jun, 2024

### Added

- Implement the post_id attribute to the futureaction shortcode, #814
- Add post permalink variable in the workflow and implement variable resolvers
- Display the data flow panel for selected nodes in the advanced mode in the workflow editor
- Add notices to the workflow editor when the workflow is saved
- Add the list of available properties to the data flow panel in the workflow editor when hovering over a input/output in the panel
- Add the trigger's name in the Scheduled Actions list, #829
- Add the title and link to the post in the Scheduled Actions list for actions added by a workflow and triggered by a post, #829
- Add the trigger's slug to the global variables in a workflow

### Fixed

- Fix some translations in ES, FR, and IT languages, #798
- Fix “no future actions” message in the scheduled actions list, #788
- Try to avoid fatal error for wrong argument counting
- Minor issues pointed by PHPCS
- Fix warning in the args column on scheduled actions list
- Fix marker end on edges in the workflow to show the arrow
- Remove broken connections when the workflow is loaded
- Fix the vertical position of the workflow editor loading message
- Fix text
- Fix bug on scheduling action based on post date

### Changed

- Improve loading message for the workflow editor
- Improve text of many strings in the workflow editor
- Improve text for the "Schedule" step fields
- Improve the help text for the priority field
- Update the help text of the "Prevent duplicate scheduling" setting
- Update language files
- Update composer files for dev dependencies
- Optimize the workflow editor script size by removing unused validation libs
- Moved the Step Data Flow panel from the developer mode to the advanced mode
- Improve visualization of available variables on the selected step
- Moved the global variables to the Step Data Flow panel
- Change the method signature of `parseNestedVariableValue` in the `PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface` interface to accept mixed in the second argument

## [3.4.0.1] - 20 Jun, 2024

### Fixed

- Fix fatal error for low level users when PublishPress menu is not available, #803
- Fix wrong action date on the future action panel, #802

### Changed

- The interface `PublishPress\Future\Modules\Expirator\Interfaces\ActionArgsModelInterface` has changed:
  - Method `setCronActionId` now returns void instead of `ActionArgsModelInterface`
  - Method `setPostId` now returns void instead of `ActionArgsModelInterface`
  - Method `setArgs` now returns void instead of `ActionArgsModelInterface`
  - Method `setArg` now returns void instead of `ActionArgsModelInterface`
  - Method `setCreatedAt` now returns void instead of `ActionArgsModelInterface`
  - Method `setEnabled` now returns void instead of `ActionArgsModelInterface`
  - Method `setScheduledDate` now returns void instead of `ActionArgsModelInterface`
  - Method `setScheduledDateFromISO8601` now returns void instead of `ActionArgsModelInterface`
  - Method `setScheduledDateFromUnixTime` now returns void instead of `ActionArgsModelInterface`
  - Method `convertUnixTimeDateToISO8601` is now public
  - Method `convertISO8601DateToUnixTime` is now public

## [3.4.0] - 20 Jun, 2024

### Added

- Add action workflow editor and engine, #687
- In the JS context, implemented a way to extend the future action panel using SlotFill `FutureActionPanelAfterActionField` and setting extra fields to the panel, right after the action field
- Add a new filter to allow filtering the options of the future action being scheduled: `publishpressfuture_prepare_post_expiration_opts`
- Add method `scheduleRecurringAction` to the `CronToWooActionSchedulerAdapter` to schedule recurring action
- Add method `scheduleAsyncAction` to the `CronToWooActionSchedulerAdapter` to schedule async action
- In the JS context, added the slot `FutureActionPanelTop` to the beginning of the future panel

### Changed

- Added `$unique` and `$priority` arguments to the `scheduleSingleAction` method in the `CronToWooActionSchedulerAdapter` class
- Method `scheduleRecurringAction` renamed to `scheduleRecurringActionInSeconds` in the `CronToWooActionSchedulerAdapter` class
- Added argument `$clearOnlyPendingActions` to the method signature `clearScheduledAction` to the `CronInterface` interface
- Changed the method `clearScheduledAction` in the class `CronToWooActionSchedulerAdapter` adding new argument `$clearOnlyPendingActions`, allowing to remove running actions
- The plugin activation and deactivation callback functions were moved from the main file to independent files
- Change the admin menu names for clarity
- Update the promo sidebar for mentioning the Actions Workflow feature

### Fixed

- Fix error when quick-edit data is not available, #730
- Fix dependency of the enqueued scripts for the future action box. Add 'wp-i18n', 'wp-components', 'wp-url', 'wp-data', 'wp-api-fetch', 'wp-element', 'inline-edit-post', 'wp-html-entities', 'wp-plugins' as dependencies
- Updated ES, FR and IT translations, #698
- Redirects to the settings page after activating the plugin, #764
- Fix access to the View Debug settings tab when debug is disabled
- Fix the position of the "Upgrade to Pro" and "Settings" menu items in the admin bar
