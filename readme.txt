=== Schedule Post Changes With PublishPress Future: Unpublish, Delete, Change Status, Trash, Change Categories ===
Contributors: publishpress, kevinB, stevejburge, andergmartins
Author: publishpress
Author URI: https://publishpress.com
Tags: unpublish posts, update posts, schedule changes, automatic changes, workflows
Requires at least: 6.7
Requires PHP: 7.4
Tested up to: 6.7
License: GPLv2 or later
Stable tag: 4.2.0

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

## [4.0.1] - 21 Oct, 2024

### Fixed

- Fix the database schema check for version 4.0.0 on fresh installations, (Issue #928).

## [4.0.0] - 21 Oct, 2024

### Added

- Add the Workflows feature, with the workflow editor and the workflow engine.

### Changes

- The list of scheduled actions now displays the repetition count/date limits (Issue #928).
- Update language files.
- Updated the UI in the advanced settings page.
- Move some advanced settings to the "Display" tab (Issue #952)
- Add title to the future action panel for UI consistency (Issue #965)
- Renamed the PublishPress Future metabox to Future Actions for UI consistency (Issue #965)

### Fixed

- Update post model to update post date when setting post status to publish.
- Prevent error when the current_post->ID is empty for unknown reasons, usually related to 3rd party plugins.

### Developers

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

## [3.4.4] - 21 Aug, 2024

### Fixed

- Improve notice message when scheduled action runs after pressing "run" (PR #896).
- Fixed support for the Event Espresso plugin (PR #900).
- Fixed React warning about createRoot being deprecated.
- Fixed empty fieldset displayed when the bos is disabled for the post type (Issue #792).
- Update language files.

### Changed

- Add tabs for post types in the post types settings page (PR #895).

### Added

- Added computed date preview to the general settings page (PR #897).
- Added option to hide the calendar by default in the future action panel (PR #899).
- Added new filter `publishpressfuture_posts_future_action_column_output` to the Future Action column.
