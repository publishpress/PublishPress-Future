# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.4.1] - 02 Jul, 2024

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
- Escape an exception message
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
- Improve the exception message when the date/time offset is invalid
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

## [3.3.1] - 19 Mar, 2024

### Added

- Add validation for the date and time offset in the settings page, #683
- Add form validation to the settings panel
- Add form validation to the metabox panel
- Add a date preview to the date/time offset setting field
- Add translation comments strings with arguments

### Changed

- The actions to move posts to another status were grouped in a single action, with a dropdown to select the status, #668
- The actions "draft", "private" and "trash" are deprecated in favor of "change-status", #668
- The metadata hash key has now a prefix "_" marking it as a private key, #695
- Improved the name of some actions
- Change the label of the field to select terms when "Replace all terms" is selected, #664
- Block editor script now loads in the footer

### Fixed

- Make it impossible to choose dates in the past, #443
- Enter key submits quick-edit panel when selecting a taxonomy term, #586
- The name of the taxonomy in the actions field is now updated in the settings panel when the taxonomy is changed, #676
- Possible to add an action using an empty category setting, #587
- Fix language files for ES, IT, FR, #685
- Fix inconsistent text in the filter for "Pending" actions, #673
- Improve the message when no actions are found: "No Future Actions", #666
- Escape string in an exception message

## [3.3.0] - 29 Feb, 2024

### Added

- Add new filter for filtering the list of post types supported by the plugin: `publishpressfuture_supported_post_types`, #677
- Add new filter for choosing to hide or not the Future Action in the post editors: `publishpressfuture_hide_metabox`, #69
- Add new filter for filtering the post metakeys in the post model: `publishpressfuture_action_meta_key`, #69
- Add new method `medataExists` to the `PublishPress\Future\Framework\WordPress\Models\PostModel` class
- Add support to a hash in the post meta `pp_future_metadata_hash`, to identify if the future action's post meta has changed or was scheduled by metadata (fully available only on PRO)
- Add metadata support for the future action data, allowing to schedule actions based on metadata (support for ACF, Pods, and other plugins), #69
- Add metadata mapping for allowing integrating with 3rd party plugins, #69
- Add a setting for hiding the Future Action metabox on the post edit screen and keeping the future actions enabled, #69
- New Gutenberg Block for displaying the future action date, #171
- Add new action `publishpressfuturepro_process_metadata` for triggering the future actions scheduling based on metadata, #69

### Changed

- Deprecated the filter `postexpirator_unset_post_types` in favor of the new filter `publishpressfuture_supported_post_types`, allowing not only removing but adding new post types to the list of supported post types, #677
- The list of post types in the settings page now also shows the non-public post types that are not built-in on WordPress, #677
- Remove the X and Facebook icons from the footer in the admin pages, #667
- Updated the URLs on the plugin's footer, #667
- Minor change in the description of the setting that controls the activation/deactivation future action for the post type
- The metadata `_expiration-date-status` now can be specified as `1` or `'1'` and not only `'saved'`, #69
- The action `publishpress_future/run_workflow` is now deprecated in favor of `publishpressfuture_run_workflow`
- When metadata support is enabled, a future action enabled is recognized by the presence of the date metadata field, ignoring the status field, #69
- Added support for other date formats in the date metadata field, not only unix timestamp, #69
- Minor changes to the layout of some settings pages
- Change the default settings tab to "Post Types" instead of "General"
- Change the links and items in the footer on the plugin's admin pages, #667

### Fixed

- Fix language files for ES, IT, FR, #665
- Fix error when a term does not exist, #675
- Add new interface for `NoticeFacade`: `NoticeInterface`
- Fatal error: Declarations of `PostStatusToCustomStatus::getLabel()` must be compatible with the interface, #674

### Removed

- Remove the legacy action `postExpiratorExpire`. This action will not trigger the future actions anymore
- Remove the legacy action `publishpressfuture_expire`. This action will not trigger the future actions anymore

## [3.2.0] - 25 Jan, 2024

### Added

- Add new advanced setting to choose the base date for the future actions: current date or post publishing date, #530
- Add the possibility to use non-hierarchical taxonomies, #285
- Add new future action to remove all taxonomy terms of a post, #652
- Add new action hook `publishpressfuture_saved_all_post_types_settings` to allow developers to trigger an action when the Post Types settings are saved

### Changed

- Deprecate the constant `PublishPress\Future\Modules\Settings\SettingsFacade::DEFAULT_CUSTOM_DATE` and replaced it with `DEFAULT_CUSTOM_DATE_OFFSET`
- Moved the date and time format settings fields to the Display tab, #605
- Added description to the taxonomy setting field in the Post Types tab, #641
- Moved the Post Types settings tab to the first position, #619
- Simplify the name of actions on taxonomy related actions, adding the actual name of the taxonomy, #294
- Change the text on the Status column in the Future Actions list, from "Pending" to "Scheduled", #661
- Fixed typos and improved the text in the Post Types settings tab, #659

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
- The field to select terms now expands when the user focuses on it, not requiring to type a search text, #633
- Increase the limit of items displayed in the field to select terms. It shows up to 1000 items now, #633

### Fixed

- Fix support for WP between 6.1 and 6.4, #625
- Fix the search of posts in the posts lists, #620
- Fix classic meta box when using Classic Editor plugin with the classic editor as default, #624
- Fix default date for new posts, #623
- Fix the quick edit form and future action column for pages, #618
- Fix support for custom taxonomies that are not shown in the Rest API, #629
- Fix compatibility with PublishPress Statuses' custom statuses, #632

## [3.1.5] - 14 Dec, 2023

### Fixed

- Fix `array_map()`: Argument must be of type array, string given, #606
- Remove broken and invalid setting to use classic metabox, #604
- Prevent a PHP warning in the posts screen if the selected term does not exist anymore, #612
- Update the ES, IT, and FR translations, #609

### Changed

- Limit the version of the library woocommerce/action-scheduler to 3.7.0, until we can set WP 6.2 as the minimum version

## [3.1.4] - 13 Dec, 2023

### Added

- Taxonomy term field now supports adding a new term by typing a new value
- Add a button to toggle the calendar on the future action panels. Quick/Bulk edit are collapsed by default, #583
- Display the taxonomy name in the future action panels instead of showing "Taxonomy", #584

### Changed

- Refactor all the future action panels to use the same React components, fixing the inconsistency between the panels, #572
- Removed external dependency of the React Select library, using now the WordPress internal library
- In the Action field on Post Type settings, the taxonomy related actions are only displayed if the post type has any term registered
- Change the order of fields in the future action panels, moving action and taxonomy at the beginning
- The method `ExpirationScheduler::schedule` now automatically converts the date to UTC before scheduling the action
- The action `publishpressfuture_schedule_expiration` now receives the date in the local site timezone
- Update the library woocommerce/action-scheduler from 3.6.4 to 3.7.0
- Future action data stored in the args column on the table _ppfuture_action_args is now camelCase
- Change the Database Schema check to verify and display multiple errors at once. The Fix Database should fix them all

### Deprecated

- Deprecate the class `Walker_PostExpirator_Category_Checklist`
- Deprecate the function `postexpirator_get_post_types`, moving the logic to the model `PostTypesModel`

### Fixed

- Fix plugin deactivation, #579
- Fix fatal error when clicking on "Post Types" tab in the settings when using PT-Br language, #567
- Stop hardcoding the DB engine when creating the table for action arguments, #565 [Thanks to @dave-p]
- Simple quotes were not being removed from the future action date offset setting, #566
- Update Spanish, French and Italian translations, #551
- Improved data sanitization on the plugin, #571
- Fix consistency on data saved on post meta from different editors, quick-edit and bulk-edit. Especially related to the post meta `_expiration-date-options`, #573
- Strange years value in the date selection, #568
- Fix the action "Remove selected term" for authors role, #550
- Fix the post type settings page not loading the saved settings after a page refresh triggered by the save button, #576


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

### Changed

- Updated base plugin to 3.1.0
- Change min PHP version to 7.2.5. If not compatible, the plugin will not execute
- Change min WP version to 5.5. If not compatible, the plugin will not execute
- Internal dependencies moved from `vendor` to `lib/vendor`, #522
- Replaced Pimple library with a prefixed version of the library to avoid conflicts with other plugins, #522
- Replaced Psr/Container library with a prefixed version of the library to avoid conflicts with other plugins, #522
- Updated internal libraries to the latest versions
- Changed the priority of the hook `plugins_loaded` on the main plugin file to 8, #522
- Changed the priority of `plugins_loaded` callback from 12 to 8
- Update `.pot` and `.mo` files

### Fixed

- Fix compatibility with Composer-based installations, using prefixed libraries, #522
- Update translations for IT, #524
- Fix some calls to the deprecated namespace `PublishPressFuture`, refactoring to the new namespace `PublishPress\Future`

## [3.0.6] - 26 Jul, 2023

### Changed

- Updated base plugin to 3.0.6

## [3.0.5] - 25 Jul, 2023

### Changed

- Updated base plugin to 3.0.5

### Fixed

- Updated .pot file, #493
- Updated translations for es_ES, fr_FR, it_IT, #493

## [3.0.4] - 04 Jul, 2023

### Changed

- Updated base plugin to 3.0.4

## [3.0.3] - 20 Jun, 2023

### Changed

- Updated base plugin to 3.0.3

## [3.0.2] - 19 Jun, 2023

### Changed

- Updated base plugin to 3.0.2

## [3.0.1] - 15 Jun, 2023

### Changed

- Updated base plugin to 3.0.1

## [3.0.0] - 13 Jun, 2023

### Changed

- Updated base plugin to 3.0.0

## [2.9.2] - 01 Mar, 2023

### Fixed

- List of actions in the post type settings is not filtered by post types, #400
- Include Statuses as a Default option, #395
- Remove legacy screenshots from the plugin root dir
- Fix i18n issues, #401
- Fix data sanitization and security issues in the log screen
- Fix PHP warning saying the method `WorkflowLogModel::countAll` returned NULL instead of an integer

## [2.9.1] - 23 Feb, 2023

### Fixed

- Fix issue with WordPress banners CSS file being missed, #393
- Fix support to delete all settings when uninstalling the plugin
- Stop automatically adding settings register if not existent and settings page is visited

## [2.9.0] - 14 Feb, 2023

### Added

- Add support for custom statuses, #224
- Add improved logs for past expiration dates, #233
