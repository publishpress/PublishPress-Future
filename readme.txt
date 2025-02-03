=== Schedule Post Changes With PublishPress Future: Unpublish, Delete, Change Status, Trash, Change Categories ===
Contributors: publishpress, kevinB, stevejburge, andergmartins
Author: publishpress
Author URI: https://publishpress.com
Tags: unpublish posts, update posts, schedule changes, automatic changes, workflows
Requires at least: 6.7
Requires PHP: 7.4
Tested up to: 6.7
License: GPLv2 or later
Stable tag: 4.3.3

PublishPress Future can make scheduled changes to your content. You can unpublish posts, move posts to a new status, update the categories, and more.

== Description ==

The PublishPress Future plugin allows you to schedule changes to posts, pages and other content types. With this plugin you can create automatic actions to unpublish, delete, trash, move a post to a new status and more. With the Pro version you can update your content using custom workflows with multiple steps and schedules.

Here's an overview of what you can do with PublishPress Future:

* Select future action dates in the right sidebar when you are editing a post. This makes it very easy to schedule changes to your content.
* Receive email notifications when Future makes changes to your content.
* Build Action Workflows that allow you to update your content using custom workflows with multiple steps and schedules (available in the Pro version).
* Control post changes via integrations with Advanced Custom Fields and other plugins (available in the Pro version).

## PublishPress Future Pro ##

> <strong>Upgrade to PublishPress Future Pro</strong><br />
> This plugin is the free version of the PublishPress Future plugin. The Pro version comes with all the features you need to schedule changes to your WordPress content. <a href="https://publishpress.com/future"  title="PublishPress Future Pro">Click here to purchase the best plugin for scheduling WordPress content updates!</a>

## Options for Future Actions on Posts

With PublishPress Future, you can configure actions that will happen automatically to your content. Here are the changes you can choose for your posts:

* Change the status to "Draft".
* Delete the post.
* Send the post to the Trash.
* Change the status to "Private".
* Enable the “Stick to the top of the blog” option.
* Disable the “Stick to the top of the blog” option.
* Remove all existing categories, and add new categories.
* Keep all existing categories, and add new categories.
* Keep all existing categories, except for those specified in this change.
* Move the post to a custom status (available in the Pro version)

[Click here for details on scheduling post changes](https://publishpress.com/knowledge-base/ways-to-expire-posts/).

## Custom Workflows to Schedule Content Changes

With PublishPress Future Pro, you can build Action Workflows. These allow you to update your content using custom workflows with multiple steps and schedules. Here are some examples of what you can do with Action Workflows:

* Email the site admin when a post is updated.
* Change the post status to “Trash” a week after it was published.
* 15 days after the post is published, move the post to the “Draft” status and add a new category.
* 1 year after a post is published, send an email to the author asking them to check the content.

[Click here for details on workflows for changes](https://publishpress.com/knowledge-base/workflows/).

## Display the Action Date in Your Content

PublishPress Future allows you to place automatically show the expiry or action date inside your articles. The date will be added at the bottom of your post.

[Click here to see the Footer Display options](https://publishpress.com/knowledge-base/footer-display/).

You can use shortcodes to show the expiration date inside your posts. You can customize the shortcode output with several formatting options.

[Click here to see the shortcode options](https://publishpress.com/knowledge-base/shortcodes-to-show-expiration-date/).

## Choose Actions Defaults for Post Types

PublishPress Future can support any post type in WordPress. Go to Settings > PublishPress Future > Defaults and you can choose default actions for each post type.

[Click here to see the default options](https://publishpress.com/knowledge-base/defaults-for-post-types/).

## PublishPress Future Email Notifications

The PublishPress Future plugin can send you email notifications when your content is changed. You can control the emails by going to Settings > PublishPress Future > General Settings.

[Click here to see the notification options](https://publishpress.com/knowledge-base/email-notifications/).

## Integrations With Other Plugins

In PublishPress Future Pro it is possible to schedule changes to your posts based on metadata. This makes it possible to integrate PublishPress Future with other plugins.  For example, you can create a date field in the Advanced Custom Fields plugin and use that to control the date for Future Actions.

When you are using an integration, there are five types of data that you can update in PublishPress Future:

* Action Status: This field specifies if the action should be enabled.
* Action Date: This field stores the scheduled date for the action.
* Action Type: This field stores the type of action that will be executed.
* Taxonomy Name: The taxonomy name for being used when selecting terms.
* Taxonomy Terms: A list of term's IDs for being used by the action.

[Click here to see how to integrate Future with other plugins](https://publishpress.com/knowledge-base/metadata-scheduling/).

## Import the Future Actions

PublishPress Future Pro supports imports from external data sources. You can import posts and automatically create Future Actions associated with those posts.

The best approach is to use the Metadata Scheduling feature. If you're using a plugin such as WP All Import, you can match up the import tables with the fields you have selected in the Metadata Scheduling feature.

[Click here to see how to import data for Future Actions](https://publishpress.com/knowledge-base/imports-and-metadata-scheduling/).

## Details on How Post Changes Works

For each expiration event, a custom cron job is scheduled. This can help reduce server overhead for busy sites. This plugin REQUIRES that WP-CRON is setup and functional on your webhost.  Some hosts do not support this, so please check and confirm if you run into issues using the plugin.

[Click here to see the technical details for this plugin](https://publishpress.com/knowledge-base/scheduling-cron-jobs/).

## Logs for All Your Post Changes

PublishPress Future Pro allows you to keep a detailed record of all the post updates. PublishPress Future records several key data points for all actions:

* The post that the action was performed on.
* Details of the post update.
* When the change was made to the post.

[Click here to see more about the logs feature](https://publishpress.com/knowledge-base/action-logs/).

## Join PublishPress and get the Pro plugins ##

The Pro versions of the PublishPress plugins are well worth your investment. The Pro versions have extra features and faster support. [Click here to join PublishPress](https://publishpress.com/pricing/).

Join PublishPress and you'll get access to these nine Pro plugins:

* [PublishPress Authors Pro](https://publishpress.com/authors) allows you to add multiple authors and guest authors to WordPress posts.
* [PublishPress Blocks Pro](https://publishpress.com/blocks) has everything you need to build professional websites with the WordPress block editor.
* [PublishPress Capabilities Pro](https://publishpress.com/capabilities) is the plugin to manage your WordPress user roles, permissions, and capabilities.
* [PublishPress Checklists Pro](https://publishpress.com/checklists) enables you to define tasks that must be completed before content is published.
* [PublishPress Future Pro](https://publishpress.com/future)  is the plugin for scheduling changes to your posts.
* [PublishPress Permissions Pro](https://publishpress.com/permissions)  is the plugin for advanced WordPress permissions.
* [PublishPress Planner Pro](https://publishpress.com/publishpress) is the plugin for managing and scheduling WordPress content.
* [PublishPress Revisions Pro](https://publishpress.com/revisions) allows you to update your published pages with teamwork and precision.
* [PublishPress Series Pro](https://publishpress.com/series) enables you to group content together into a series

Together, these plugins are a suite of powerful publishing tools for WordPress. If you need to create a professional workflow in WordPress, with moderation, revisions, permissions and more... then you should try PublishPress.

= Bug Reports =

Bug reports for PublishPress Future are welcomed in our [repository on GitHub](https://github.com/publishpress/publishpress-future). Please note that GitHub is not a support forum, and that issues that are not properly qualified as bugs will be closed.

== Installation ==

This section describes how to install the plugin and get it working.

1. Unzip the plugin contents to the `/wp-content/plugins/post-expirator/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Screenshots ==

1. You can select future action dates in the right sidebar when you are editing a post. This works with Gutenberg, the Classic Editor, and most page builder plugins.
2. You can modify action dates using the “Quick Edit” and “Bulk Edit” modes. This enables you to quickly add automatic actions to as many posts as you need.
3. PublishPress Future allows you to modify, remove or completely delete content when the scheduled date arrives.
4. The PublishPress Future plugin can send you email notifications when automatic actions happen on your content.
5. PublishPress Future allows you to choose action dates for post, pages, WooCommerce products, LearnDash classes, or any other custom post types.
6. PublishPress Future allows you to automatically show the scheduled date inside your articles. The action date will be added at the bottom of your post. You can also use shortcodes to show the action date and customize the output.
7. The PublishPress Future plugin creates a log of all the modified posts. This allows you to have a detailed record of all the automatic actions for your posts.
8. PublishPress Future Pro supports custom statuses such as those provided by WooCommerce. This means that Pro users can set their content to move to any status in WordPress.

== Frequently Asked Questions ==

= Can I schedule changes to WooCommerce Products? =

Yes, the PublishPress Future plugin allows you to schedule automatic changes to posts, pages and other content types including WooCommerce products. To enable this feature, go to Future > Post Types. Check the “Active” box in the “Product” area.

[Click here for more details on WooCommerce changes](https://publishpress.com/knowledge-base/schedule-changes-woocommerce-products/)

= Can I schedule changes to Elementor posts? =

Yes, the PublishPress Future plugin allows you to schedule automatic changes to posts, pages and other content types including WooCommerce products. To enable this feature, go to Future > Post Types. Check the “Active” box for the post type you're using with Elementor.

[Click here for more details on Elementor post changes](https://publishpress.com/knowledge-base/schedule-changes-elementor/)

== Changelog ==

The full changelog can be found on [GitHub](https://github.com/publishpress/PublishPress-Future/blob/main/CHANGELOG.md).

## [4.3.3] - 03 Feb, 2025

### Fixed

- Fix the overdue actions check in the Scheduled Actions list screen (Issue #1155).
- Update translations (Issue #1156).

## [4.3.2] - 30 Jan, 2025

### Fixed

- Fix typo in the `WorkflowEngine` class.
- Fix reference to deprecated classes and interfaces.
- Fix translation of shortcode settings in the Display settings page.

## [4.3.1] - 30 Jan, 2025

### Added

- Add new option to the Schedule workflow step to select the behavior when a duplicate scheduled action is found (Issue #956).
- Add daily check and notification for past-due actions, with settings to enable/disable and customize the email addresses (Issue #229).
- Add check for overdue actions in the Scheduled Actions list screen (Issue #232).
- Add new validation rule to check if the expression is valid in the workflow editor (Issue #742).
- Add new validation rule to check if the value of a field has invalid variable references (Issue #969).

### Changed

- Change the workflow step custom label to be a step description and still display the original step label (Issue #1114).
- Changed text and description of fields in the Settings page (Issues #1097, #1103, #1104, #1105).
- Changed the field description in the Post Query step (Issue #1100).
- Changed the label of the "Schedule" workflow step to "Schedule delay" (Issue #1122).
- Changed the label of the "On Cron Schedule" trigger to "On schedule" (Issue #1122).
- Changed the label of the "Conditional split" workflow step to "Conditional" (Issue #1117).
- Changed the color of the "False" branch in the "Conditional" workflow step to a slightly darker color.
- Changed the "Not" field in the "Conditional" workflow step to only be displayed when there are rules (Issue #1118).
- Changed the description of the "Conditional" workflow step conditions modal (Issue #1118).
- Changed the validation rule message of the "Stick" and "Unstick" workflow steps (Issue #1101).
- Changed the message in the Scheduled Actions list screen when a scheduled action is missing its original Schedule step (Issue #971).
- Removed the "Single variable mode" from the text in the expression builder (Issue #1118).
- Automatically select post-related settings and defaults in workflow steps that interact with posts (Issue #969).
- Removed the screenshot feature from the workflow editor (Issue #1135).
- Changed the label and description of some workflow steps for making it more intuitive (Issue #1101).
- Changed the default duplicate handling on workflow stepsto "Replace existing task" (Issue #956).
- Step "Ray - Debug" renamed to "Send to Ray" (Issue #1143).
- Step "Debug Log" renamed to "Append to debug log" (Issue #1143).
- Step "Conditional" renamed to "Conditional Delay".
- Changed the default step's slug to reflect the new step name and classes.
- Changed the Schedule Delay step settings to be more intuitive.
- Changed some text in the workflow editor to be more user friendly.

### Fixed

- Fix SQL syntax error in MariaDB lower than 11.6 when deleting orphan scheduled steps (Issue #1087).
- Update translations (Issue #1113).
- Fix extra line (empty value character) on some post in the future action column (Issue #1106).
- Fix error when the step being executed is not found (Issue #1123).
- Fix the space on right margin of the workflow editor nodes.
- Fix queries in the `ScheduledActionsModel` to use the group ID.
- Fix infinite loop detection in post related triggers when fired by a bulk edit action (Issue #943).
- Fix space on the outputs of the workflow steps in the Scheduled Actions list screen.
- Fix performance issue when validating the workflow editor nodes (Issue #1137).
- Fix the constructor of some workflow triggers (Issue 1141).
- Fix the error related to wrong arguments passed to sprintf on nl_NL language (Issue #1138).
- Fix the JS error when the expression builder is opened with an expression containing only numbers (Issue #1142).
- Fix specific text stripping tags from translated string.

### Developers

- Refactor the method `deleteExpiredScheduledSteps` in the class `ScheduledActionsModel` renaming it to `deleteExpiredDoneActions`.
- Add new method `getExpiredPendingActions` to the class `ScheduledActionsModel`.
- Deprecated the method `isInfinityLoopDetected` in the trait `InfiniteLoopPreventer` and use the method `isInfiniteLoopDetected` instead.
- Add new argument `$uniqueId` to the method `isInfiniteLoopDetected` in the trait `InfiniteLoopPreventer` (Issue #943).
- Remove the methods `convertLegacyScreenshots`, `setScreenshotFromBase64`, `setScreenshotFromFile` and `getScreenshotUrl` from the class `WorkflowModel` (Issue #1135).
- Remove the methods `convertLegacyScreenshots`, `setScreenshotFromBase64`, `setScreenshotFromFile` and `getScreenshotUrl` from the interface `WorkflowModelInterface` (Issue #1135).
- Remove the methods `getWorkflowScreenshotStatus`, and `setWorkflowScreenshotStatus` from the class `SettingsFacade` (Issue #1135).
- Refactored step types and step runners moving files to new folder structure (Issue #1143).
- Refactored most of the code renaming "Node" to "Step", "NodeRunner" to "StepRunner", and so on (Issue #1148).

## [4.3.0] - 08 Jan, 2025

### Added

- Add new variables selector and an expression builder (Issue #976).
- Add support to metadata in the variables resolvers and post type variables (Issue #1069, #939).
- Add the site ID to the site data type schema.
- Add the post author property to the post data type schema in the workflow editor (Issue #947).
- Add the post slug property to the post data type schema in the workflow editor.
- Add new trigger: Post is Published - PRO (Issue #944).
- Add new trigger: Post Status Changes - PRO (Issue #945).
- Add new trigger: Post is Scheduled - PRO (Issue #946).
- Add new trigger: Post Meta Changed - PRO (Issue #1059).
- Add new action: Post Meta Add - PRO (Issue #732).
- Add new action: Post Meta Delete - PRO (Issue #732).
- Add new action: Post Meta Update - PRO (Issue #732).
- Add the option to change manually enabled workflows in the bulk edit screen (Issue #942).
- Add the "Save as current status" shortcut to the workflow editor (CTRL/CMD + S) (Issue #1084).
- Add new display settings to customize the shortcode output (Issue #203).
- Add new step setting field to customize the step label in the workflow editor (Issue #1090).
- Add Future Action data support in the workflow editor, allowing to reference future actions in expressions (Issue #948).

### Changed

- Replace text fields and input/variables selectors on step settings with the new expression builder (Issue #976).
- Changed the border of selected steps to dashed line.
- Moved the panel "Step Data Flow" to the developer mode.
- Removed the arrow indicator from the workflow title and added a new Status column to the workflows list screen (Issue #970).
- Post's variable resolver now also accept a property without `post_` prefix.
- User's variable resolver now also accept a property without `user_` prefix.
- Changed the options in the "Debug Data" field to be more intuitive allowing a custom data expression to be selected.
- The conditional step now uses the new expression builder.
- Improved the UI in the conditional step settings.
- Added field descriptions to the post query step settings panel (Issue #1081).
- Only display the bulk edit option "Update Future Action from Post Metadata" if feature is enabled (Issue #622).
- Updated language files.
- Remove focus from the toolbar Delete button when workflow step is selected (Issue #1083).
- Improved the text in the variables selector modal.

### Fixed

- Fix error when the date or time format is empty in the settings page (Issue #212).
- Fix empty title and label in the future action panel when custom title and label are not set (Issue #1075).
- Fix the width of the checkbox in the future action panel (#1076).
- Fix the permalink in the Post Updated trigger for the post before variable.
- Fix the variable names in the "Add extra terms to post" step (Issue #1079).
- Fix the validation message for the recipient field in the Send Email step (Issue #1078).
- Fix the date format in the shortcode.
- Fix loading a workflow that doesn't have a specific step type (Issue #883).
- Fix the first save of a workflow to transit from auto-saved to draft (Issue #1086).
- Fix warning about deprecated jQuery click() method in the workflow editor.
- Fix the auto-layout algorithm to avoid overlapping edges and correctly dimension each node and spacing between nodes (Issue #1102).
- Fix the warning about deprecated method `next` in the class `ActionScheduler_Schedule` (Issue #1107).

### Developers

- Deprecated the method `get_wp_date` in the class `PostExpirator_Util` and use the method `getWpDate` from the class `PublishPress\Future\Framework\WordPress\Facade\DateTimeFacade instead.
- Deprecated the method `wp_timezone_string` in the class `PostExpirator_Util` and use the method `getTimezoneString` from the class `PublishPress\Future\Framework\System\DateTimeHandler` instead.
- Deprecated the method `get_timezone_offset` in the class `PostExpirator_Util`.
- Deprecated the method `sanitize_array_of_integers` in the class `PostExpirator_Util`.
- Add new param $metaValue to the method `deleteMeta` in the class `PublishPress\Future\Framework\WordPress\Models\PostModel`.
- Remove the `steps` property from the workflow data type schema.

## [4.2.0] - 09 Dec, 2024

### Added

- Add new admin page to export and import workflows and plugin settings (Issue #704).
- Add global variable `global.execution_id` to the workflow engine to identify the current execution of the workflow.
- Add setting fields to customize the metabox title and checkbox label (Issue #227).
- Add method `disableExpiration` to the class `PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel`.
- Add `*` to indicate required fields in the workflow editor (Issue #974).
- Add new setting to disable/enable the screenshot feature in the workflow editor (Issue #1066).
- Add new Custom Data option to "Ray - Debug step" to debug custom expressions on workflows (Issue #1067).
- Add support to metadata when evaluating expressions in a workflow. Post, site, user and workflow (post) metadata are now available when evaluating expressions (Issue #1069).
- Add support to custom email addresses using the post metadata when sending emails in a workflow (Issue #939).

### Changed

- Move notification settings to a specific tab (Issue #190).
- Disable the workflow screenshot feature by default (Issue #1066).
- Changed the Message field in the "Log - Add" step displaying a textarea instead of a text field (Issue #1068).
- Changed the Custom Email Addresses field in the Send Email step to be a textarea (Issue #939).
- Changed the Subject field in the Send Email step to be a textarea (Issue #939).
- Set the default value of Email Recipient on Send Email step to Site Admin (Issue #1071).

### Fixed

- Do not remove expiration post meta when clearing the scheduled action (Issue #1053).
- Fix DB error when deleting orphan scheduled steps (Issue #1060).
- Potential fix for DOM text reinterpretation as HTML issue.
- Fix error when a trigger node type is not found.
- Fix warning PHP Deprecated:  ltrim(): Passing null to parameter #1 ($string) of type string on the Scheduled Actions table.
- Fix error on table ScheduledActionsTable refactoring calls to `next` instead of `get_date`.
- Fix displaced labels for checkboxes in the Future Actions metabox and manual workflow activation checkbox (Issue #1057).
- Fix translations for user roles in the plugin settings page (Issue #1050).
- Fix error on Post Status filter in the Post Updated trigger (Issue #1074).

## [4.1.3] - 22 Nov, 2024

### Added

- Add check for the constant `PUBLISHPRESS_FUTURE_FORCE_DEBUG` to force debug mode.

### Fixed

- Fix error on fresh install about missing table (Issue #1051).

## [4.1.2] - 21 Nov, 2024

### Fixed

- Fix translations (Issues #1003, #1006, #1007, #1026).
- Updated pt-BR translations (Issue #10018).
- Updated es, it, fr translations (Issue #1047).
- Fix zombie auto-drafts appearing in the future when auto-enable is activated (Issue #1024).
- Fix call to undefined function `error_log` (Issue #1036).
- Fix the page title in the workflow editor (Issue #1027).
- Fix the page title on admin pages of 3rd party plugins (Issue #1037).
- Updated the pt-BR translations.
- Fix the size of Pro badge on step inserter in the workflow editor.

## [4.1.1] - 12 Nov, 2024

### Fixed

- Fix the layout of inserter in the workflow editor for WP 6.7 (Issue #1025).
- Fix the layout of the top toolbar in the workflow editor for WP 6.7 (Issue #1028).

### Changed

- Minimum required version of WordPress is now 6.7.
- Minimum required version of PHP is now 7.4.

## [4.1.0] - 11 Nov, 2024

### Added

- Add more detailed debug logs to the workflow engine (Issue #724).
- Add button to copy the debug logs to the clipboard (Issue #724).
- Add "Published" status to the legacy expiration statuses (Issue #1023).
- Add new workflow step to write a log message (Issue #690).

### Fixed

- Fixed the timezone in the default date applied from default action time (Issue #1005).
- Fixed the timezone in the date preview (Issue #1004).

### Changed

- Improved the debug log viewer adding text to a textarea (Issue #724).
- Improve the debug log viewer adding a button to download the entire log or copy it to the clipboard (Issue #724).
- The debug log viewer now automatically scrolls to the bottom when the page loads (Issue #724).
- Deprecate the class `PublishPress\Future\Modules\Debug\Debug` and use the logger facade instead.
- Better handling of the exceptions and errors thrown by the plugin.
- Removed the admin submenu item "Scheduled Actions" and added a button in the workflows list screen (Issue #1022).
- Removed the "post-expirator-debug.php" file which is no longer used.

### Developers

- Add new class `PublishPress\Future\Framework\System\DateTimeHandler` to handle date and time operations.
- Change the REST API `/settings/validate-expire-offset` endpoint return value renaming `preview` to `calculatedTime`.
- Change the REST API `/settings/validate-expire-offset` endpoint to log an error message when the offset is invalid.
- Add `DateTimeHandlerInterface` as dependency to the class `PublishPress\Future\Modules\Expirator\Models\PostTypeDefaultDataModel`.
- Add `LoggerInterface` as dependency to the class `PublishPress\Future\Modules\Expirator\Module`.
- Add `DateTimeHandlerInterface` as dependency to the class `PublishPress\Future\Modules\Expirator\Module`.
- Deprecated the constant `PublishPress\Future\Core::ACTION_ADMIN_ENQUEUE_SCRIPT` in favor of `PublishPress\Future\Core::ACTION_ADMIN_ENQUEUE_SCRIPTS`.
- Remove the action `publishpressfuture_workflow_engine_running_step` from the workflow engine.
- Add new methods to the class `PublishPress\Future\Framework\Logger\Logger` to retrieve the log count, the log size, and to fetch the latest logs.
- Node runner processors now accept a branch argument to get the next steps and run the next steps.

## [4.0.4] - 24 Oct, 2024

### Fixed

- Fix the workflows list screen to be shown only to users with `manage_options` capability (Issue #998).
- Fix compatibility with the "WP Remote User Sync" plugin (Issue #999).

## [4.0.3] - 22 Oct, 2024

### Changed

- Add the banner notice to the workflows list screen.

### Fixed

- Fix PHP warning when post attribute is empty in the workflow model (Issue #987, #988).
- Fix error when`manage_posts_columns` filter do not receive a post type (Issue #990).
- Fix error about undefined index: date (Issue #991).

## [4.0.2] - 21 Oct, 2024

### Fixed

- Fix error when the filter `the_title` is called without an ID, #984
