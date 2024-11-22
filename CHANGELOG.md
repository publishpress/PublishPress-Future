# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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

- Fix error when the filter `the_title` is called without an ID (Issue #984).

## [4.0.1] - 21 Oct, 2024

### Fixed

- Fix the database schema check for version 4.0.0 on fresh installations, (Issue #928).

## [4.0.0] - 01 Oct, 2024

### Added

- Add the Workflows feature, with the workflow editor and the workflow engine.

### Fixed

- Update post model to update post date when setting post status to publish.
- Prevent error when the current_post->ID is empty for unknown reasons, usually related to 3rd party plugins.

### Changes

- The list of scheduled actions now displays the repetition count/date limits (#928).
- Update language files.

### Code changes

- Interface `PublishPress\Future\Core\HookableInterface`: Add new method `removeFilter` to remove a hooked filter.
- Interface `PublishPress\Future\Core\HookableInterface`: Add new method `removeAction` to remove a hooked action.
- Class `PublishPress\Future\Framework\WordPress\Facade\HooksFacade`: Add new method `removeFilter` to remove a hooked filter.
- Class `PublishPress\Future\Framework\WordPress\Facade\HooksFacade`: Add new method `removeAction` to remove a hooked action.
- New method to publish posts using the class PublishPress\Future\Framework\WordPress\Models\PostModel.
- Add new filter 'publishpressfuture_migrations' to filter the list of migrations that will be executed.
- Call the action 'publishpressfuture_fix_db_schema' when a DB fix is executed from the settings page.
- Call the action 'publishpressfuture_upgrade_plugin' when the plugin is upgraded.
- Change the data type from void to int for the method 'PublishPress\Future\Modules\Expirator\Interfaces]CronInterfac::scheduleRecurringAction'.
- Change the data type from void to int for the method 'PublishPress\Future\Modules\Expirator\Interfaces]CronInterfac::scheduleAsyncAction'.
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

## [3.4.3] - 06 Aug, 2024

### Changed

- Remove icon from the Future metabox in the block editor, #821

### Fixed

- Update translation files
- Only load the quick-edit script if in the post list screen
- Fix quick edit action box to use the filter to hide action box when deactivated for the post type, #884
- Fixed the database schema check to also check the debug log table, #887
- Fixed the database schema check to check the table indexes, #887

## [3.4.2] - 15 Jul, 2024

### Added

- Add the current date and time to date preview in the date/time offset setting field, #840

### Fixed

- Optimized the date/time offset validation requests in the Post Types settings, #840
- Fix error message in the date/time offset setting field, #841
- Fix user capabilities check in the block editor, #727
- Update ES, FR, and IT translations, #859

### Changed

- Change the text in the promo screen for the Actions Workflow feature, #867

## [3.4.1] - 02 Jul, 2024

### Added

- Implement add promo screen for Actions Workflows, #777
- Implement the post_id attribute to the futureaction shortcode, #814

### Fixed

- Fix some translations in ES, FR, and IT languages, #798
- Fix “no future actions” message in the scheduled actions list, #788
- Try to avoid fatal error for wrong argument counting
- Minor issues pointed by PHPCS
- Escape an exception message

### Changed

- Update language files
- Improve the exception message when the date/time offset is invalid
- Update composer files for dev dependencies

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
- Improve exception message when the date/time offset is invalid

## [3.4.0] - 20 Jun, 2024

### Added

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

## [3.3.1] - 19 Mar, 2024

### Added

- Add validation for the date and time offset in the settings page, #683
- Add form validation to the settings panel
- Add form validation to the metabox panel
- Add a date preview to the date/time offset setting field

### Changed

- The actions to move posts to another status where grouped in a single action, with a dropdown to select the status, #668
- The actions "draft", "private" and "trash" are deprecated in favor of "change-status", #668
- The metadata hash key has now a prefix "_" marking it as a private key, #695
- Improved the name of some actions
- Change the label of the field to select terms when "Replace all terms" is selected, #664

### Fixed

- Make it impossible to choose dates in the past, #443
- Enter key submits quick-edit panel when selecting a taxonomy term, #586
- The name of the taxonomy in the actions field is now updated in the settings panel when the taxonomy is changed, #676
- Possible to add an action using an empty category setting, #587
- Fix language files for ES, IT, FR, #685
- Fix inconsistent text in the filter for "Pending" actions, #673
- Improve the message when no actions are found: "No Future Actions", #666

## [3.3.0] - 28 Feb, 2024

### Added

- Add new filter for filtering the list of post types supported by the plugin: `publishpressfuture_supported_post_types`, #677
- Add new filter for choosing to hide or not the Future Action in the post editors: `publishpressfuture_hide_metabox`, #69
- Add new filter for filtering the post metakeys in the post model: `publishpressfuture_action_meta_key`, #69
- Add new method `medataExists` to the `PublishPress\Future\Framework\WordPress\Models\PostModel` class
- Add support to a hash in the post meta `pp_future_metadata_hash`, to identify if the future action's post meta has changed or was scheduled by metadata (fully available only on PRO)

### Changed

- Deprecated the filter `postexpirator_unset_post_types` in favor of the new filter `publishpressfuture_supported_post_types`, allowing not only removal but addition of new post types to the list of supported post types, #677
- The list of post types in the settings page now also shows the non-public post types that are not built-in on WordPress, #677
- Remove the X and Facebook icons from the footer in the admin pages, #667
- Updated the URLs on the plugin's footer, #667
- Minor change in the description of the setting that controls the activation/deactivation future action for the post type
- The metadata `_expiration-date-status` now can be specified as `1` or `'1'` and not only `'saved'`, #69
- The action `publishpress_future/run_workflow` is now deprecated in favor of `publishpressfuture_run_workflow`

### Fixed

- Fix language files for ES, IT, FR, #665
- Fix error when a term does not exist, #675
- Add new interface for NoticeFacade: NoticeInterface

### Removed

- Remove the legacy action `postExpiratorExpire`. This action will not trigger the future actions anymore
- Remove the legacy action `publishpressfuture_expire`. This action will not trigger the future actions anymore

## [3.2.0] - 25 Jan, 2024

### Added

- Add the possibility to use non-hierarchical taxonomies, #285
- Add new future action to remove all taxonomy terms of a post, #652
- Add new action hook `publishpressfuture_saved_all_post_types_settings` to allow developers to trigger an action when the Post Types settings are saved

### Changed

- Deprecate the constant `PublishPress\Future\Modules\Settings\SettingsFacade::DEFAULT_CUSTOM_DATE` and replaced it with `::DEFAULT_CUSTOM_DATE_OFFSET`
- Moved the date and time format settings fields to the Display tab, #605
- Added description to the taxonomy setting field in the Post Types tab, #641
- Moved the Post Types settings tab to the first position, #619
- Simplify the name of actions on taxonomy-related actions, adding the actual name of the taxonomy, #294
- Change the text on the Status column in the Future Actions list, from "Pending" to "Scheduled", #661
- Fixed typos and improved the text in the Post Types settings tab, #659
- The list of supported post types in the settings page only shows public post types, and non-public that are built-in and show the UI

### Fixed

- Fix consistency on radio buttons alignment on the settings page
- Hides the legacy cron event field from Diagnostics and Tools settings tab if no legacy cron event is found
- Fix the "Change Status to Trash action" on custom post types, #655
- Added back support for reusable blocks, #200
- Updated the language files, #653
- Fix error 404 when activating future action on a post type that has no taxonomy registered, #662

## [3.1.7] - 04 Jan, 2024

### Fixed

- Fix compatibility with plugins like "Hide Categories and Products for WooCommerce", making sure terms are not hidden in the taxonomy field, #639
- Fix the terms select field in the settings page, expanding it on focus, #638
- Fix the fatal error when hook `add_meta_boxes` didn't receive a `WP_Post` instance as parameter, #640
- Fix issue with the "NaN" categories in the classic editor, #647
- Fix issue with accents on the taxonomy field in the settings, #642

## [3.1.6] - 20 Dec, 2023

### Added

- Add a new setting to select the time format in the date picker component, #626

### Changed

- Stick the library woocommerce/action-scheduler on version 3.7.0, so we don't force WP min to 6.2
- Min WP version is now 6.1, #627
- The field to select terms now expands when the user focus on it, not requiring to type a search text, #633
- Increase the limit of items displayed in the field to select terms. It shows up to 1000 items now, #633

### Fixed

- Fix support for WP between 6.1 and 6.4, #625
- Fix the search of posts in the posts lists, #620
- Fix classic meta box when using Classic Editor plugin with the classic editor as default, #624
- Fix default date for new posts, #623
- Fix the quick edit form and future action column for pages, #618
- Fix support to custom taxonomies that are not shown in the Rest API, #629

## [3.1.5] - 14 Dec, 2023

### Fixed

- Fix array_map(): Argument must be of type array, string given, #606
- Remove broken and invalid setting to use classic metabox, #604
- Prevent a PHP warning in the posts screen if the selected term does not exist anymore, #612
- Update the ES, IT and FR translations, #609

## [3.1.4] - 13 Dec, 2023

### Added

- Taxonomy term field now supports adding a new term by typing a new value
- Add a button to toggle the calendar on the future action panels. Quick/Bulk edit are collapsed by default, #583
- Display the taxonomy name in the future action panels instead of showing "Taxonomy", #584

### Changed

- Refactor all the future action panels to use the same React components, fixing the inconsistency between the panels, #572
- Removed external dependency of the React Select library, using now the WordPress internal library
- In the Action field on Post Type settings, the taxonomy-related actions are only displayed if the post type has any term registered
- Change the order of fields in the future action panels, moving action and taxonomy to the beginning
- The method `ExpirationScheduler::schedule` now automatically converts the date to UTC before scheduling the action
- The action `publishpressfuture_schedule_expiration` now receives the date in the local site timezone
- Update the library woocommerce/action-scheduler from 3.6.4 to 3.7.0
- Future action data stored in the args column on the table _ppfuture_action_args is now camelCase
- Change the Database Schema check to verify and display multiple errors at once. The Fix Database should fix them all

### Deprecated

- Deprecate the class `Walker_PostExpirator_Category_Checklist`
- Deprecate the function `postexpirator_get_post_types`, moving the logic to the model `PostTypesModel`

### Fixed

- Fix fatal error when clicking on "Post Types" tab in the settings when using PT-Br language, #567
- Stop hardcoding the DB engine when creating the table for action arguments, #565 [Thanks to @dave-p]
- Simple quotes were not being removed from the future action date offset setting, #566
- Update Spanish, French, and Italian translations, #551
- Improved data sanitization on the plugin, #571
- Fix consistency on data saved on post meta from different editors, quick-edit, and bulk-edit. Especially related to the post meta "_expiration-date-options", #573
- Strange years value in the date selection, #568
- Fix the action "Remove selected term" for authors role, #550
- Fix the post type settings page not loading the saved settings after a page refresh triggered by the save button, #576
- Fix PHP warning: Creation of dynamic property $hooks in NoticeFacade.php, #580
- Fix call to undefined function ...Expirator\Adapters\as_has_scheduled_action, #574
- Fix PHP warning: Class ...Expirator\Models\DefaultDataModel not found in ...legacy/deprecated.php, #582
- Update the X/Twitter icon on the footer of admin pages, #583
- Fix the use of custom taxonomies on the future action panels, #585
- Fix call to the method `manageUpgrade` on ...Core\Plugin
- Fix action for deleting posts without sending to trash, #593
- Fix action that sends a post to trash, to trigger the expected actions, #597
- Fix empty cells on Actions table when Pro plugin is uninstalled and Free is activated, #595

### Removed

- Internal function `postexpirator_add_footer` was removed, and the footer is now handled in the `ContentController` class
- Internal function `postexpirator_get_footer_text` was removed

## [3.1.3] - 09 Nov, 2023

### Fixed

- Fix JS error Cannot read properties of undefined (reading ‘length’) on the block editor, #561

## [3.1.2] - 07 Nov, 2023

### Changed

- Update the library woocommerce/action-scheduler from 3.6.3 to 3.6.4

### Fixed

- Fix compatibility with WP 6.4 removing dependency of lodash, #555

## [3.1.1] - 11 Oct, 2023

### Added

- Add new bulk action for posts to update future action scheduler based on post's metadata, #538

### Deprecated

- Deprecate class `PublishPress\Future\Core\DI\ContainerNotInitializedException`
- Deprecate class `PublishPress\Future\Core\DI\ServiceProvider`
- Deprecate interface `PublishPress\Future\Core\DI\ServiceProviderInterface`

### Fixed

- Fix compatibility with 3rd party plugins that import posts, #538
- Fix JS error when admin user has no permissions, #533 (Thanks to @raphaelheying)
- Fix missed post link on the email notification, or actions log, when the post is deleted, #507
- Fix plugin activation hook not running on plugin activation, #539

### Removed

- Remove tooltip from the "Expires" column in the posts list, #511

## [3.1.0] - 06 Sep, 2023

### Fixed

- Fix compatibility with Composer-based installations, using prefixed libraries, #522
- Fix notice about using `FILTER_SANITIZE_STRING` on PHP 8, #525

### Changed

- Remove the file `define-base-path.php`. The constant `PUBLISHPRESS_FUTURE_BASE_PATH` is deprecated and is now defined in the main plugin file
- Internal dependencies moved from `vendor` to `lib/vendor`, #522
- Replaced Pimple library with a prefixed version of the library to avoid conflicts with other plugins, #522
- Replaced Psr/Container library with a prefixed version of the library to avoid conflicts with other plugins, #522
- Change min PHP version to 7.2.5. If not compatible, the plugin will not execute
- Change min WP version to 5.5. If not compatible, the plugin will not execute
- Updated internal libraries to the latest versions
- Changed the priority of the hook `plugins_loaded` on the main plugin file from 10 to 5, #522
- Removed the `vendor-locator-future` library. Internal vendor is now on a fixed path, `lib/vendor`, #522
- Deprecated constant `PUBLISHPRESS_FUTURE_VENDOR_PATH` in favor of `PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH`
- Update Action Scheduler library to 3.6.2
- Update the .pot and .mo files

## [3.0.6] - 26 Jul, 2023

### Fixed

- Fix JavaScript error on the block editor: Uncaught TypeError: Cannot read properties of undefined (reading 'indexOf'), #517
- Fix fatal error on content with shortcode: Call to undefined method ...ExpirablePostModel::getExpirationDateAsUnixTime, #516

## [3.0.5] - 25 Jul, 2023

### Added

- Add a setting field to control the style of the Future Action column on posts lists (Advanced tab), #482

### Fixed

- Fix the message that prevented to select terms for a future action, #488
- Fix the taxonomy field in the Post Types settings page, that was not visible unless you select a taxonomy-related default action, #496
- Fix the space after the "reset" button on the calendar field, in the block editor, #465
- Fix error displayed when trying to deactivate the plugin with "Preserve data after deactivating the plugin" as "Delete data", #499
- Fix DB error when trying to create the action args table, due to DESCRIBE query on a table that does not exist yet, #450
- Fix default expiration date time for post type on different timezones
- Fix date and time on block editor with different timezones, #498
- Fix missed title and post type info in emails or logs when the post is deleted, #507
- Notice: Undefined variable: gmt_schedule_display_string, in the columns in the Future Action screens, #504
- Update ES, FR, and IT translations, #509

### Changed

- Improve the label for the terms field in the block editor panel, #483
- Merge the settings tabs "Diagnostics" and "Tools", #501
- Update the .pot file
- Renamed the settings tab "Defaults" to "General"
- Added some instructions comments to translators
- The default date interval for global and post type settings now only accepts EN format, $495
- Add log message when date time offset is invalid when trying to schedule a future action
- Change the date format on "Scheduled Date" column in the Future Actions list to use the site timezone and not GMT date. GMT date is now displayed on the tooltip
- Changed text and buttons labels on Diagnostics and Tools settings tab, #506
- Add method `getExpirationDateAsUnixTime` to the ExpirablePostModel class
- Changed method `getTitle` on ExpirablePostModel to return title from args if post is not found anymore
- Changed method `getPostType` on ExpirablePostModel to return post type from args if post is not found anymore

### Deprecated

- The methods `getDefaultDate` and `getDefaultDateCustom` on SettingsFacade class are deprecated

## [3.0.4] - 04 Jul, 2023

### Fixed

- Fix "Save changes" notification on block editor when post is not edited, #449
- Fix unchecked category on classic editor when editing a post with future action enabled, #481
- Update French translation, #473
- Fix the plugin initialization to properly load the plugin text domain, and CLI commands
- Fix the start of the week on the calendar, honoring the site setting, #484
- Fix the taxonomy field for custom post types
- Fix consistency in the message in the block editor, compared to classic editor, when no taxonomy is selected
- Update the .pot file

### Changed

- The name of the block editor component changed from `postexpirator-sidebar` to `publishpress-future-action`, #449
- Update the Action Scheduler library from 3.6.0 to 3.6.1

### Removed

- Remove internal function `postexpirator_init`

## [3.0.3] - 20 Jun, 2023

### Fixed

- Error on the block editor: The "postexpirator-sidebar" plugin has encountered an error and cannot be rendered, #475
- Error message in the future action column: Action scheduled but its definition is not available anymore, #474

### Changed

- Update message when future action data is corrupted for the post

## [3.0.2] - 19 Jun, 2023

### Fixed

- Fix warning displayed in the classic editor if a taxonomy is not properly selected, #453
- Fix typo in a message when a taxonomy is not properly selected
- Fix a blank post type label in the Arguments column in the Actions Log list when a post type is not registered anymore
- Fix error message in the Future Action column if the action is not found anymore, #454
- Fix default date/time offset, #455
- Fix label "Action" on a few screens, #458
- Fix broken screen due to a long select field in Classic Editor, #458
- Fix Future action ordering not working on "Posts" screen, #462
- Update .pot file and some translation strings

## [3.0.1] - 15 Jun, 2023

### Added

- Add diagnostic check for DB schema in the Settings page

### Changed

- Changed privacy for method `PublishPress\Future\Framework\WordPress\Models\PostModel::getPostInstance` from `private` to `protected`

### Fixed

- Restore future action data on post meta fields, #452
- Fix PHP warning about undefined index 'categoryTaxonomy'
- Fix auto-enabled future action on new posts, #447
- Fix default future action type on custom post types
- First letter of future actions log is not capitalized on some messages in the popup view
- Fix log message when actions related to taxonomy terms run

## [3.0.0] - 13 Jun, 2023

### Added

- Add Dutch translation files, #429

### Changed

- Namespace has been changed from `PublishPressFuture` to `PublishPress\Future`
- Functions, autoload, class aliases and class loading have been moved into a hook for the action `plugins_loaded` with priority 10
- Post expiration queue migrated from WP Cron to Action Scheduler library from WooCommerce, #149
- Deprecate hook "publishpressfuture_expire" in favor of "publishpress_future/run_workflow". New hook has two arguments: postId and action, #149
- Changed the label "Type" to "Action" in the bulk edit field
- Change the capability checked before authorizing API usage. Changed from `edit_posts` to `publishpress_future_expire_post`
- Added the old post status in the log message when the post expires changing status
- Change the text of options in the bulk edit field, for more clearance
- Change text of Post Types settings tab
- Replace "Expiry" with "Actions", #392

### Fixed

- Fix PHP warning about undefined index 'terms', #412
- Fix error on block editor: can't read "length" of undefined
- Fix escaping on a few admin text
- Fix text and positions of expiration fields in the bulk edit form
- Fix email notifications, #414
- Fix PHP Fatal error: Uncaught TypeError: gmdate(): Argument #2 ($timestamp) must be of type ?int, #413
- All the expirations scheduled to the future run if we call "wp cron events run --all", #340
- Deactivation of the plugin does not remove the cron jobs and settings, #107
- Can we make the cron schedule more human-readable, #231
- Expiration actions related to taxonomy are not working if default way to expire is not taxonomy related, #409
- Database error on a new site install, #424
- Bulk Edit Text doesn't match Quick Edit, #422
- Expiration Email Notification is not working, #414
- Capital case for statuses, #430
- Make sure all files have protection against direct access, #436
- Fix fatal error sending expiration email, #434, #433

## [2.9.2] - 28 Feb, 2023

### Fixed

- List of actions in the post type settings is not filtered by post types, #400
- Include Statuses as a Default option, #395
- Remove legacy screenshots from the plugin root dir
- Fix i18n issues, #401

## [2.9.1] - 23 Feb, 2023

### Fixed

- Fix location of wordpress-banners style CSS when started by the Pro plugin, #393

## [2.9.0] - 23 Feb, 2023

### Added

- Add new filter for filtering the expiration actions list: `publishpressfuture_expiration_actions`
- Add new constant `PUBLISHPRESS_FUTURE_BASE_PATH` to define the base path of the plugin
- Added hooks to extend settings screen
- Added ads and banners for the Pro plugin

### Changed

- Refactored the UI for the Post Types settings screen closing the fields if not activated, #335, #378
- Refactored the services container to be used by the Pro plugin
- Changed the order of some settings field in the Post Types settings screen

### Fixed

- Fix hook `transition_post_status` running twice, #337
- Fix bug with choosing a taxonomy change as a default, #335
- Updated FR and IT translations, #336 (thanks to @wocmultimedia)
- HTML escaping for a field on the settings screen
- Fix the expiration date column date format
- Fix option to clear data on uninstall, removing the debug table
- Combining Multiple Cron Events #149

## [2.8.3] - 10 Jan, 2023

### Added

- Add new filters for allowing customizing the expiration metabox and the email sent when post is expired, #327 (thanks to Menno)

### Changed

- Changed pattern of expiration debug log messages to describe the action in a clearer way and add more details
- Changed the label and description of the setting field for default date and time expiration offset, #310

### Fixed

- Remove debug statement, #326
- Fix text for default date/time expiration setting description
- Fix PHP 8 error and remove extract functions, #328
- Simplify setting to set default expiration date/time interval, removing invalid "none" option, #325
- Simplify unscheduling removing duplicated code, #329
- Fix PHP warning and fatal error when post's expiration categories list is not an array, #330

## [2.8.2] - 20 Dec, 2022

### Fixed

- Fix taxonomy expiration, #309
- Fix TypeError in `ExpirablePostModel.php`: array_unique(): Argument #1 ($array) must be of type array, #318

## [2.8.1] - 08 Dec, 2022

### Fixed

- Fix PHP warning: attempt to read property "ID" on null in the "the_content" filter, #313
- Fix PHP warning: undefined array key "properties" in `class-wp-rest-meta-fields.php`, #311
- Update language files to ES, FR, and IT (thanks to @wocmultimedia), #308

## [2.8.0] - 08 Nov, 2022

### Added

- Add translations for ES, FR, IT languages, #297

### Changed

- Removed the "None" option from default expiration dates. If a site is using it, the default value is now "Custom" and set for "+1 week", #274
- The code was partially refactored improving the code quality, applying DRY and other good practices
- Deprecated some internal functions: `postexpirator_activate`, `postexpirator_autoload`, `postexpirator_schedule_event`, `postexpirator_unschedule_event`, `postexpirator_debug`, `_postexpirator_get_cat_names`, `postexpirator_register_expiration_meta`, `postexpirator_expire_post`, `expirationdate_deactivate`
- Deprecated the constant: `PostExpirator_Facade::PostExpirator_Facade` => `PublishPressFuture\Modules\Expirator\CapabilitiesAbstract::EXPIRE_POST`
- Deprecated the constant `POSTEXPIRATOR_DEBUG`
- Deprecated the method `PostExpirator_Facade::set_expire_principles`
- Deprecated the method `PostExpirator_Facade::current_user_can_expire_posts`
- Deprecated the method `PostExpirator_Facade::get_default_expiry`
- Deprecated the method `PostExpirator_Util::get_wp_date`
- Deprecated the class `PostExpiratorDebug`
- Deprecated the constants: `POSTEXPIRATOR_VERSION`, `POSTEXPIRATOR_DATEFORMAT`, `POSTEXPIRATOR_TIMEFORMAT`, `POSTEXPIRATOR_FOOTERCONTENTS`, `POSTEXPIRATOR_FOOTERSTYLE`, `POSTEXPIRATOR_FOOTERDISPLAY`, `POSTEXPIRATOR_EMAILNOTIFICATION`, `POSTEXPIRATOR_EMAILNOTIFICATIONADMINS`, `POSTEXPIRATOR_DEBUGDEFAULT`, `POSTEXPIRATOR_EXPIREDEFAULT`, `POSTEXPIRATOR_SLUG`, `POSTEXPIRATOR_BASEDIR`, `POSTEXPIRATOR_BASENAME`, `POSTEXPIRATOR_BASEURL`, `POSTEXPIRATOR_LOADED`, `POSTEXPIRATOR_LEGACYDIR`

### Fixed

- Fix the expire date column in WooCommerce products list, #276
- Improve output escaping on a few views, #235
- Improve input sanitization, #235
- Add argument swapping on strings with multiple arguments, #305
- Expiration settings not working on Classic Editor, #274
- Fixed remaining message "Cron event not found!" for expirations that run successfully, #288

## [2.7.8] - 17 Oct, 2022

### Changed

- Rename "Category" in the expiration options to use a more generic term: "Taxonomy"
- Fixed typo in the classical metabox (classical editor)

### Fixed

- Fix bulk edit when expiration is not enabled for the post type, #281
- Fix custom taxonomies support, #50

## [2.7.7] - 14 Jul, 2022

### Added

- Add post meta "expiration_log" with expiration log data when post expires

### Fixed

- Can't bulk edit posts if hour or minutes are set to 00, #273
- When the post expires to draft we don't trigger the status transition actions, #264

## [2.7.6] - 13 Jun, 2022

### Fixed

- Fix fatal error on cron if debug is not activated, #265

## [2.7.5] - 09 Jun, 2022

### Fixed

- Fix undefined array key "hook_suffix" warning, #259
- Double email sending bug confirmed, #204

## [2.7.4] - 07 Jun, 2022

### Changed

- Add library to protect breaking site when multiple instances of the plugin are activated
- Invert order of the debug log, showing now in ASC order
- Make bulk edit date fields required, #256

### Fixed

- Fix unlocalized string on the taxonomy field (Thanks to Alex Lion), #255
- Fix default taxonomy selection for Post Types in the settings, #144
- Fix typo in the hook name 'postexpirator_schedule' (Thanks to Nico Mollet), #244
- Fix bulk editing for WordPress v6.0, #251
- Fix the Gutenberg panel for custom post types created on PODS in WordPress v6.0, #250

## [2.7.3] - 27 Jan, 2022

### Fixed

- Fix the selection of categories when setting a post to expire, #220

## [2.7.2] - 25 Jan, 2022

### Added

- Added the event GUID as tooltip to each post in the Current Cron Schedule list on the Diagnostics page, #214

### Changed

- Added more clear debug message if the cron event was not scheduled due to an error
- Refactored the list of cron schedules in the Diagnostics tab adding more post information, #215
- Removed the admin notice about the plugin renaming

### Fixed

- Fix the Expires column in the posts page correctly identifying the post ID on cron event with multiple IDs, #210
- Fix wrong function used to escape HTML attributes on a settings page
- Fix missed sanitization for some data on admin pages
- Fix some false positives given by PHPCS
- Fix expiration data processing to avoid processing for deactivated posts
- Fix a typo in the diagnostics settings tab
- Fix the checkbox state for posts that are not set to expire, #217

## [2.7.1] - 12 Jan, 2022

### Added

- Add visual indicator to the cron event status in the settings page, #155
- Add small help text to the Expires column icon to say if the event is scheduled or not
- Add additional permission check before loading the settings page
- Add CLI command to expire a post, #206

### Changed

- Remove the plugin description from the settings page, #194
- Deprecated a not used function called `expirationdate_get_blog_url`
- Updated the min required WP to 5.3 due to the requirement of using the function `wp_date`

### Fixed

- Fix PHP error while purging the debug log, #135
- Fix composer's autoloader path
- Code cleanup: removed comments and dead code
- Fixed the block for direct access to view files
- Added check for `is_admin` before checking if the user has permission to see the settings page
- Avoid running sortable column code if not in the admin
- Cross-site scripting (XSS) was possible if a third party allowed HTML or JavaScript into a database setting or language file
- Fix the URL for the View Debug Log admin page, #196
- Removed unopened span tag from a form
- Added a secondary admin and ajax referer check when saving expiration post data
- Fix the option "Preserve data after deactivating the plugin" that was not saving the setting, #198
- Fix the post expiration function to make sure a post is not expired if the checkbox is not checked on it, #199
- Fix the post expiration meta not being cleaned up after a post expires, #207
- Fix the post expiration checkbox status when post type is set to check it by default

## [2.7.7] - 14 Jul, 2022

### Added

- Add post meta "expiration_log" with expiration log data when post expires

### Fixed

- Can't bulk edit posts if hour or minutes are set to 00, #273
- When the post expires to draft we don't trigger the status transition actions, #264

## [2.7.6] - 13 Jun, 2022

### Fixed

- Fix fatal error on cron if debug is not activated, #265

## [2.7.5] - 09 Jun, 2022

### Fixed

- Fix undefined array key "hook_suffix" warning, #259
- Double email sending bug confirmed, #204

## [2.7.4] - 07 Jun, 2022

### Changed

- Add library to protect breaking site when multiple instances of the plugin are activated
- Invert order of the debug log, showing now in ASC order
- Make bulk edit date fields required, #256

### Fixed

- Fix unlocalized string on the taxonomy field (Thanks to Alex Lion), #255
- Fix default taxonomy selection for Post Types in the settings, #144
- Fix typo in the hook name 'postexpirator_schedule' (Thanks to Nico Mollet), #244
- Fix bulk editing for WordPress v6.0, #251
- Fix the Gutenberg panel for custom post types created on PODS in WordPress v6.0, #250

## [2.7.3] - 27 Jan, 2022

### Fixed

- Fix the selection of categories when setting a post to expire, #220

## [2.7.2] - 25 Jan, 2022

### Added

- Added the event GUID as tooltip to each post in the Current Cron Schedule list on the Diagnostics page, #214

### Changed

- Added more clear debug message if the cron event was not scheduled due to an error
- Refactored the list of cron schedules in the Diagnostics tab adding more post information, #215
- Removed the admin notice about the plugin renaming

### Fixed

- Fix the Expires column in the posts page correctly identifying the post ID on cron event with multiple IDs, #210
- Fix wrong function used to escape HTML attributes on a settings page
- Fix missed sanitization for some data on admin pages
- Fix some false positives given by PHPCS
- Fix expiration data processing to avoid processing for deactivated posts
- Fix a typo in the diagnostics settings tab
- Fix the checkbox state for posts that are not set to expire, #217

## [2.7.1] - 12 Jan, 2022

### Added

- Add visual indicator to the cron event status in the settings page, #155
- Add small help text to the Expires column icon to say if the event is scheduled or not
- Add additional permission check before loading the settings page
- Add CLI command to expire a post, #206

### Changed

- Remove the plugin description from the settings page, #194
- Deprecated a not used function called `expirationdate_get_blog_url`
- Updated the min required WP to 5.3 due to the requirement of using the function `wp_date`

### Fixed

- Fix PHP error while purging the debug log, #135
- Fix composer's autoloader path
- Code cleanup: removed comments and dead code
- Fixed the block for direct access to view files
- Added check for `is_admin` before checking if the user has permission to see the settings page
- Avoid running sortable column code if not in the admin
- Cross-site scripting (XSS) was possible if a third party allowed HTML or JavaScript into a database setting or language file
- Fix the URL for the View Debug Log admin page, #196
- Removed unopened span tag from a form
- Added a secondary admin and ajax referer check when saving expiration post data
- Fix the option "Preserve data after deactivating the plugin" that was not saving the setting, #198
- Fix the post expiration function to make sure a post is not expired if the checkbox is not checked on it, #199
- Fix the post expiration meta not being cleaned up after a post expires, #207
- Fix the post expiration checkbox status when post type is set to check it by default

## [2.7.0] - 02 Dec, 2021

### Added

- Add new admin menu item: Future, #8

### Changed

- Rename the plugin from Post Expirator to PublishPress Future, #14
- Add the PublishPress footer and branding, #68
- Separate the settings into different tabs, #97, #98
- Rename the "General Settings" tab to "Default", #99

### Fixed

- Fix the 1hr diff between expiration time when editing and shown in post list, #138
- Post Expirator is adding wrong expiry dates to old posts, #160
- Post Expirator is setting unwanted expire time for posts, #187

## [2.6.3] - 18 Nov, 2021

### Added

- Add setting field for choosing between preserve or delete data when the plugin is deactivated, #137

### Fixed

- Fix the timezone applied to time fields, #134
- Add the timezone string to the time fields, #134
- Fix the selected expiring categories on the quick edit panel, #160
- Fix E_COMPILER_ERROR when cleaning up the debug table, #183
- Fix translation and localization of date and time, #150

## [2.6.2] - 04 Nov, 2021

### Fixed

- Fix fatal error: Call to a member function add_cap() on null, #167
- Fix hierarchical taxonomy selection error for multiple taxonomies, #144
- Fix PHP warning: use of undefined constant - assumed 'expireType', #617
- Fix translation of strings in the block editor panel, #163
- Fix category not being added or removed when the post expires, #170
- Fix PHP notice: Undefined variable: merged, #174
- Fix category-based expiration for custom post types in classic editor, #179
- Fix expiration date being added to old posts when edited, #168

## [2.6.1] - 27 Oct, 2021

### Added

- Add post information to the scheduled list for easier debugging, #164
- Add a review request after a specific period of usage, #103
- Improve the list of cron tasks, filtering only the tasks related to the plugin, #153

### Fixed

- Fix category replace not saving, #159
- Fix auto enabled settings, #158
- Fix expiration data and cron on Gutenberg style box, #156, #136
- Fix the request that loads categories in the Gutenberg style panel, #133
- Fix the category replace not working with the new Gutenberg style panel, #127
- Fix the default options for the Gutenberg style panel, #145

## [2.6.0] - 04 Oct, 2021

### Added

- Add specific capabilities for expiring posts, #141

## [2.5.1] - 27 Sep, 2021

### Fixed

- Default Expiration Categories cannot be unset, #94
- Tidy up design for Classic Editor version, #83
- All posts now carry the default expiration, #115
- Error with 2.5.0 and WordPress 5.8.1, #110
- Do not show private post types that don't have an admin UI, #116

## [2.5.0] - 08 Aug, 2021

### Added

- Add "How to Expire" to Quick Edit, #62
- Support for Gutenberg block editor, #10
- Set a default time per post type, #12

### Changed

- Settings UI enhancement, #14

### Fixed

- Appearance Widgets screen shows PHP Notice, #92
- Stop the PublishPress Future box from appearing in non-public post types, #78
- Hide metabox from Media Library files, #56

## [2.4.4] - 22 Jul, 2021

### Fixed

- Fix conflict with the plugin WCFM, #60
- Fix the Category: Remove option, #61

## [2.4.3] - 07 Jul, 2021

### Added

- Expose wrappers for legacy functions, #40
- Support for quotes in Default expiry, #43

### Changed

- Bulk and Quick Edit boxes default to current date/year, #46

### Fixed

- Default expiry duration is broken for future years, #39
- Translation bug, #5
- Post expiring one year early, #24

## [2.4.2]

### Fixed

- Bulk edit does not change scheduled event bug, #29
- Date not being translated in shortcode, #16
- Bulk Edit doesn't work, #4

## [2.4.1]

### Fixed

- Updated deprecated .live jQuery reference

## [2.4.0]

### Fixed

- Fixed PHP Error with PHP 7

## [2.3.1]

### Fixed

- Fixed PHP Error that snuck in on some installations

## [2.3.0]

### Added

- Email notification upon post expiration. A global email can be set, blog admins can be selected and/or specific users based on post type can be notified
- Expiration Option Added - Stick/Unstick post is now available
- Expiration Option Added - Trash post is now available
- Added custom actions that can be hooked into when expiration events are scheduled / unscheduled

### Fixed

- Minor HTML Code Issues

## [2.2.2]

### Fixed

- Quick Edit did not retain the expire type setting, and defaulted back to "Draft". This has been resolved

## [2.2.1]

### Fixed

- Fixed issue with bulk edit not correctly updating the expiration date

## [2.2.0]

### Added

- Quick Edit - setting expiration date and toggling post expiration status can now be done via quick edit
- Bulk Edit - changing expiration date on posts that already are configured can now be done via bulk edit
- Added ability to order by Expiration Date in dashboard
- Adjusted formatting on defaults page. Multiple post types are now displayed cleaner

### Fixed

- Minor Code Cleanup

## [2.1.4]

### Fixed

- PHP Strict errors with 5.4+
- Removed temporary timezone conversion - now using core functions again

## [2.1.3]

### Fixed

- Default category selection now saves correctly on default settings screen

## [2.1.2]

### Added

- Added check to show if WP_CRON is enabled on diagnostics page

### Fixed

- Minor Code Cleanup

### Security

- Added form nonce for protection against possible CSRF
- Fixed XSS issue on settings pages

## [2.1.1]

### Added

- Added the option to disable post expirator for certain post types if desired

### Fixed

- Fixed php warning issue caused when post type defaults are not set

## [2.1.0]

### Added

- Added support for hierarchical custom taxonomy
- Enhanced custom post type support

### Fixed

- Updated debug function to be friendly for scripted calls
- Change to only show public custom post types on defaults screen
- Removed category expiration options for 'pages', which is currently unsupported
- Some date calls were getting "double" converted for the timezone pending how other plugins handled date - this issue should now be resolved

## [2.0.1]

### Changed

- Old option cleanup

### Removed

- Removes old scheduled hook - this was not done completely in the 2.0.0 upgrade

## [2.0.0]

### Added

- Improved debug calls and logging
- Added the ability to expire to a "private" post
- Added the ability to expire by adding or removing categories. The old way of doing things is now known as replacing categories
- Revamped the expiration process - the plugin no longer runs on a minute, hourly, or other schedule. Each expiration event schedules a unique event to run, conserving system resources and making things more efficient
- The type of expiration event can be selected for each post, directly from the post editing screen
- Ability to set defaults for each post type (including custom posts)
- Renamed `expiration-date` meta value to `_expiration-date`
- Revamped timezone handling to be more correct with WordPress standards and fix conflicts with other plugins
- 'Expires' column on post display table now uses the default date/time formats set for the blog

### Fixed

- Removed `kses` filter calls when the schedule task runs that was causing code entered as `unfiltered_html` to be removed
- Updated some calls of `date` to now use `date_i18n`
- Most (if not all) PHP error/warnings should be addressed
- Updated `wpdb` calls in the debug class to use `wpdb_prepare` correctly
- Changed menu capability option from "edit_plugin" to "manage_options"

### Release Note

This is a major update of the core functions of this plugin. All current plugins and settings should be upgraded to the new formats and work as expected. Any posts currently scheduled to be expired in the future will be automatically upgraded to the new format.

## [1.6.2]

### Added

- Added the ability to configure the post expirator to be enabled by default for all new posts

### Changed

- Some instances of `mktime` to `time`

### Fixed

- Fixed missing global call for MS installs

## [1.6.1]

### Added

- Added option to allow user to select any cron schedule (minute, hourly, twicedaily, daily) - including other defined schedules
- Added option to set default expiration duration - options are none, custom, or publish time

### Fixed

- Tweaked error messages, removed clicks for reset cron event
- Switched cron schedule functions to use `current_time('timestamp')`
- Cleaned up default values code
- Code cleanup - PHP notice

## [1.6.0]

### Added

- Added debugging

### Changed

- Replaced "Upgrade" tab with new "Diagnostics" tab
- Various code cleanup

### Fixed

- Fixed invalid HTML
- Fixed i18n issues with dates
- Fixed problem when using "Network Activate" - reworked plugin activation process
- Reworked expire logic to limit the number of SQL queries needed

## [1.5.4]

### Changed

- Cleaned up deprecated function calls

## [1.5.3]

### Fixed

- Fixed bug with SQL expiration query (props to Robert & John)

## [1.5.2]

### Fixed

- Fixed bug with shortcode that was displaying the expiration date in the incorrect timezone
- Fixed typo on settings page with incorrect shortcode name

## [1.5.1]

### Fixed

- Fixed bug that was not allowing custom post types to work

## [1.5.0]

### Changed

- Moved Expirator Box to Sidebar and cleaned up meta code

### Added

- Added ability to expire post to category

## [1.4.3]

### Fixed

- Fixed issue with 3.0 multisite detection

## [1.4.2]

### Added

- Added post expirator POT to /languages folder

### Fixed

- Fixed issue with plugin admin navigation
- Fixed timezone issue on plugin options screen

## [1.4.1]

### Added

- Added support for custom post types (Thanks Thierry)
- Added i18n support (Thanks Thierry)

### Fixed

- Fixed issue where expiration date was not shown in the correct timezone in the footer
- Fixed issue where on some systems the expiration did not happen when scheduled

## [1.4.0]

### Fixed

- Fixed compatibility issues with WordPress - plugin was originally coded for WPMU - should now work on both
- Fixed timezone - now uses the same timezone as configured by the blog

### Added

- Added ability to schedule post expiration by minute

### Release Note

After upgrading, you may need to reset the cron schedules. Following on-screen notice if prompted. Previously scheduled posts will not be updated, they will be deleted referencing the old timezone setting. If you wish to update them, you will need to manually update the expiration time.

## [1.3.1]

### Fixed

- Fixed sporadic issue of expired posts not being removed

## [1.3.0]

### Fixed

- Expiration date is now retained across all post status changes
- Modified date/time format options for shortcode postexpirator tag

### Added

- Added the ability to add text automatically to the post footer if expiration date is set

## [1.2.1]

### Fixed

- Fixed issue with display date format not being recognized after upgrade

## [1.2.0]

### Changed

- Wording from "Expiration Date" to "Post Expirator" and moved the configuration options to the "Settings" tab

### Added

- Added shortcode tag `[postexpirator]` to display the post expiration date within the post
- Added new setting for the default format

### Fixed

- Fixed bug where expiration date was removed when a post was auto saved

## [1.1.0]

### Fixed

- Expired posts retain expiration date

## [1.0.0]

### Added

- The initial release
