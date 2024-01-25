=== PublishPress Future Pro: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins, rozroz
Author: publishpress
Author URI: https://publishpress.com
Tags: expire, posts, pages, schedule
Requires at least: 6.1
Requires PHP: 7.2.5
License: GPLv2 or later
Tested up to: 6.4
Stable tag: 3.2.0

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

= [3.2.0] - 25 Jan, 2024 =

* ADDED: Add new advanced setting to choose the base date for the future actions: current date or post publishing date #530;
* ADDED: Add the possibility to use non hierarchical taxonomies, #285;
* ADDED: Add new future action to remove all taxonomy terms of a post, #652;
* ADDED: Add new action hook `publishpressfuture_saved_all_post_types_settings` to allow developers to trigger an action when the Post Types settings are saved;
* CHANGED: Deprecate the constant PublishPress\Future\Modules\Settings\SettingsFacade::DEFAULT_CUSTOM_DATE and replaced it with ::DEFAULT_CUSTOM_DATE_OFFSET;
* CHANGED: Moved the date and time format settings fields to the Display tab, #605;
* CHANGED: Added description to the taxonomy setting field in the Post Types tab, #641;
* CHANGED: Moved the Post Types settings tab to the first position, #619;
* CHANGED: Simplify the name of actions on taxonomy related actions, adding the actual name of the taxonomy, #294;
* CHANGED: Change the text on the Status column in the Future Actions list, from "Pending" to "Scheduled", #661;
* CHANGED: Fixed typos and improved the text in the Post Types settings tab, #659;
* FIXED: Fix consistency on radio buttons alignment on the settings page;
* FIXED: Hides the legacy cron event field from Diagnostics and Tools settings tab if no legacy cron event is found;
* FIXED: Fix the "Change Status to Trash action" on custom post types, #655;
* FIXED: Added back support for reusable blocks, #200;
* FIXED: Updated the language files, #653;
* FIXED: Fix error 404 when activating future action on a post type that has no taxonomy registered, #662;

= [3.1.7] - 04 Jan, 2024 =

* FIXED: Fix compatibility with plugins like "Hide Categories and Products for Woocommerce", making sure terms are not hidden in the taxonomy field, #639;
* FIXED: Fix the terms select field in the settings page, expanding it on focus, #638;
* FIXED: Fix the fatal error when hook `add_meta_boxes` didn't receive a `WP_Post` instance as parameter, #640;
* FIXED: Fix issue with the "NaN" categories in the classic editor, #647;
* FIXED: Fix issue with accents on the taxonomy field in the settings, #642;

= [3.1.6] - 20 Dec, 2023 =

* ADDED: Add a new setting to select the time format in the date picker component, #626;
* CHANGED: Stick the library woocommerce/action-scheduler on version 3.7.0, so we don't force WP min to 6.2;
* CHANGED: Min WP version is now 6.1, #627;
* CHANGED: The field to select terms now expands when the user focus on it, not requiring to type a search text, #633;
* CHANGED: Increase the limit of items displayed i nthe the field to select terms. It shows up to 1000 items now, #633;
* FIXED: Fix support for WP between 6.1 and 6.4, #625;
* FIXED: Fix the search of posts in the posts lists, #620;
* FIXED: Fix classic meta box when using Classic Editor plugin with the classic editor as default, #624;
* FIXED: Fix default date for new posts, #623;
* FIXED: Fix the quick edit form and future action column for pages, #618;
* FIXED: Fix support to custom taxonomies that are not showed in the Rest API, #629;
* FIXED: Fix compatibility with PublishPress Statuses' custom statuses, #632;

= [3.1.5] - 14 Dec, 2023 =

* FIXED: Fix array_map(): Argument must be of type array, string given, #606;
* FIXED: Remove broken and invalid setting to use classic metabox, #604;
* FIXED: Prevent a PHP warning in the posts screen if the selected term do not exists anymore, #612;
* FIXED: Update the ES, IT and FR translations, #609;
* CHANGED: Limit the version of the library woocommerce/action-scheduler to 3.7.0, until we can set WP 6.2 as the minimum version;

= [3.1.4] - 13 Dec, 2023 =

* ADDED: Taxonomy term field now supports adding a new term by typing a new value;
* ADDED: Add a button to toggle the calendar on the future action panels. Quick/Bulk edit are collapsed by default, #583;
* ADDED: Display the taxonomy name in the future action panels instead of showing "Taxonomy", #584;
* CHANGED: Refactor all the future action panels to use the same React components, fixing the inconsistency between the panels, #572;
* CHANGED: Removed external dependency of the React Select library, using now the WordPress internal library;
* CHANGED: In the Action field on Post Type settings, the taxonomy related actions are only displayed if the post type has any term registered;
* CHANGED: Change the order of fields in the future action panels, moving action and taxonomy at the beginning
* CHANGED: The method `ExpirationScheduler::schedule` now automatically converts the date to UTC before scheduling the action;
* CHANGED: The action `publishpressfuture_schedule_expiration` now receives the date in the local site timezone;
* CHANGED: Update the library woocommerce/action-scheduler from 3.6.4 to 3.7.0;
* CHANGED: Future action data stored in the args column on the table _ppfuture_action_args is now camelCase;
* CHANGED: Change the Database Schema check to verify and display multiple errors at once. The Fix Database should fix them all;
* DEPRECATED: Deprecate the calss `Walker_PostExpirator_Category_Checklist`;
* DEPRECATED: Deprecate the function `postexpirator_get_post_types`, moving the logic to the model `PostTypesModel`;
* FIXED: Fix plugin deactivation, #579;
* FIXED: Fix fatal error when clicking on "Post Types" tab in the settings when using PT-Br language, #567;
* FIXED: Stop hardcoding the DB engine when creating the table for action arguments, #565 [Thanks to @dave-p];
* FIXED: Simple quotes were not being removed from the future action date offset setting, #566;
* FIXED: Update Spanish, Franch and Italian translations, #551;
* FIXED: Improved data sanitization on the plugin, #571;
* FIXED: Fix consistency on data saved on post meta from different editors, quick-edit and bulk-edit. Specially related to the post meta "_expiration-date-options", #573;
* FIXED: Strange years value in the date selection, #568;
* FIXED: Fix the action "Remove selected term" for authors role, #550;
* FIXED: Fix the post type settings page not loading the saved settings after a page refresh triggered by the save button, #576;
* FIXED: Fix PHP warning: Creation of dynamic property $hooks in NoticeFacade.php, #580;
* FIXED: Fix call to undefined function ...Expirator\Adapters\as_has_scheduled_action, #574
* FIXED: Fix PHP warning: Class ...Expirator\Models\DefaultDataModel not found in ...legacy/deprecated.php, #582;
* FIXED: Update the X/Twitter icon on the footer of admin pages, #583;
* FIXED: Fix the use of custom taxonomies on the future action panels, #585;
* FIXED: Fix call to the method `manageUpgrade on ...Core\Plugin;
* FIXED: Fix action for deleting posts without sending to trash, #593;
* FIXED: Fix action that sends a port to trash, to trigger the expected actions, #597;
* FIXED: Fix empty cells on Actions table when Pro plugin is uninstalled and Free is activated, #595;
* REMOVED: Internal function `postexpirator_add_footer` was removed, and the footer is now handled in the `ContentController` class;
* REMOVED: Internal function `postexpirator_get_footer_text` was removed;

= [3.1.3] - 09 Nov, 2023 =

* FIXED: Fix JS error Cannot read properties of undefined (reading ‘length’) on the block editor, #561;

= [3.1.2] - 07 Nov, 2023 =

* CHANGED: Update the library woocommerce/action-scheduler from 3.6.3 to 3.6.4;
* FIXED: Fix compatibility with WP 6.4 removing dependency of lodash, #555;

= [3.1.1] - 11 Oct, 2023 =

* ADDED: Add new bulk action for posts to update future action scheduler based on post's metadata, #538;
* DEPRECATED: Deprecate class PublishPress\Future\Core\DI\ContainerNotInitializedException;
* DEPRECATED: Deprecate class PublishPress\Future\Core\DI\ServiceProvider;
* DEPRECATED: Deprecate interface PublishPress\Future\Core\DI\ServiceProviderInterface;
* FIXED: Fix compatibility with 3rd party plugins that import posts, #538;
* FIXED: Fix JS error when admin user has no permissions, #533 (Thanks to @raphaelheying);
* FIXED: Fix missed post link on the email notification, or actions log, when the post is deleted, #507;
* FIXED: Fix plugin activation hook not running on plugin activation, #539;
* REMOVED: Remove tooltip from the "Expires" column in the posts list, #511;

= [3.1.0] - 06 Sep, 2023 =

* CHANGED: Updated base plugin to 3.1.0;
* CHANGED: Change min PHP version to 7.2.5. If not compatible, the plugin will not execute;
* CHANGED: Change min WP version to 5.5. If not compatible, the plugin will not execute;
* CHANGED: Internal dependencies moved from `vendor` to `lib/vendor`, #522;
* CHANGED: Replaced Pimple library with a prefixed version of the library to avoid conflicts with other plugins, #522;
* CHANGED: Replaced Psr/Container library with a prefixed version of the library to avoid conflicts with other plugins, #522;
* CHANGED: Updated internal libraries to the latest versions;
* CHANGED: Changed the priority of the hook `plugins_loaded` on the main plugin file to 8, #522;
* CHANGED: Changed the priority of plugins_loaded callback from 12 to 8;
* CHANGED: Update `.pot` and `.mo` files;
* FIXED: Fix compatibility with Composer-based installations, using prefixed libraries, #522;
* FIXED: Update translations for IT, #524;
* FIXED: Fix some calls to the deprecated namespace `PublishPressFuture`, refactoring to the new namespace `PublishPress\Future`;

= [3.0.6] - 26 Jul 2023 =

* CHANGED: Updated base plugin to 3.0.6;

= [3.0.5] - 25 Jul 2023 =

* CHANGED: Updated base plugin to 3.0.5;
* FIXED: Updated .pot file, #493;
* FIXED: Updated translations for es_ES, fr_FR, it_IT, #493;

= [3.0.4] - 04 Jul 2023 =

* CHANGED: Updated base plugin to 3.0.4;

= [3.0.3] - 20 Jun 2023 =

* CHANGED: Updated base plugin to 3.0.3;

= [3.0.2] - 19 Jun 2023 =

* CHANGED: Updated base plugin to 3.0.2;

= [3.0.1] - 15 Jun 2023 =

* CHANGED: Updated base plugin to 3.0.1;

= [3.0.0] - 13 Jun 2023 =

* CHANGED: Updated base plugin to 3.0.0;

= [2.9.2] - 01 Mar 2023 =

* FIXED: List of actions in the post type settings is not filtered by post types, #400;
* FIXED: Include Statuses as a Default option, #395;
* FIXED: Remove legacy screenshots from the plugin root dir;
* FIXED: Fix i18n issues, #401;
* FIXED: Fix data sanitization and security issues in the log screen;
* FIXED: Fix PHP warning saying the method `WorkflowLogModel::countAll` returned NULL instead of an integer;

= [2.9.1] - 23 Feb 2023 =

* FIXED: Fix issue with WordPress banners css file being missed, #393;
* FIXED: Fix support to delete all settings when uninstalling the plugin;
* FIXED: Stop automatically adding settings register if not existent and settings page is visited;

= [2.9.0] - 14 Feb 2023 =

* ADDED: Add support for custom statuses, #224;
* ADDED: Add improved logs for past expiration dates, #233;
