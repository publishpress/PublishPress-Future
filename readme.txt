=== PublishPress Future Pro: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins, rozroz
Author: publishpress
Author URI: https://publishpress.com
Tags: expire, posts, pages, schedule
Requires at least: 6.5
Requires PHP: 7.2.5
License: GPLv2 or later
Tested up to: 6.5
Stable tag: 3.3.1

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

= [3.3.1] - 19 Mar, 2024 =

* ADDED: Add validation for the date and time offset in the settings page, #683;
* ADDED: Add form validation to the settings panel;
* ADDED: Add form validation to the metabox panel;
* ADDED: Add a date preview to the date/time offset setting field;
* ADDED: Add translation comments strings with arguments;
* CHANGED: The actions to move posts to another status where grouped in a single action, with a dropdown to select the status, #668;
* CHANGED: The actions "draft", "private" and "trash" are deprecated in favor of "change-status", #668;
* CHANGED: The metadata hash key has now a prefix "_" marking it as a private key, #695;
* CHANGED: Improved the name of some actions;
* CHANGED: Change the label of the field to select terms when "Replace all terms" is selected, #664;
* CHANGED: Block editor script now loads in the footer;
* FIXED: Make it impossible to choose dates in the past, #443;
* FIXED: Enter key submits quick-edit panel when selecting a taxonomy term, #586;
* FIXED: The name of the taxonomy in the actions field is now updated in the settings panel when the taxonomy is changed, #676;
* FIXED: Possible to add an action using an empty category setting, #587;
* FIXED: Fix language files for ES, IT, FR, #685;
* FIXED: Fix inconsistent text in the filter for "Pending" actions, #673;
* FIXED: Improve the message when no actions are found: "No Future Actions", #666;
* FIXED: Escape string in a exception message;

= [3.3.0] - 29 Feb, 2024 =

* ADDED: Add new filter for filtering the list of post types supported by the plugin: publishpressfuture_supported_post_types, #677;
* ADDED: Add new filter for choosing to hide or not the Future Action in the post editors: publishpressfuture_hide_metabox, #69;
* ADDED: Add new filter for filtering the post metakeys in the post model: publishpressfuture_action_meta_key, #69;
* ADDED: Add new method `medataExists` to the `PublishPress\Future\Framework\WordPress\Models\PostModel` class;
* ADDED: Add support to a hash in the the post meta `pp_future_metadata_hash`, to identify if the future action's post meta has changed or was scheduled by metadata (fully availale only on PRO);
* ADDED: Add metadata support for the future action data, allowing to schedule actions based on metadata (support for ACF, Pods, and other plugins), #69;
* ADDED: Add metadata mapping for allowing integrating with 3rd party plugins, #69;
* ADDED: Add a setting for hiding the Future Action metabox on the post edit screen and keeping the future actions enabled, #69;
* ADDED: New Gutenberg Block for displaying the future action date, #171;
* ADDED: Add new action `publishpressfuturepro_process_metadata` for triggering the future actions scheduling based on metadata, #69;
* CHANGED: Deprecated the filter `postexpirator_unset_post_types` in favor of the new filter `publishpressfuture_supported_post_types`, allowing not only remove, but add new post types to the list of supported post types, #677;
* CHANGED: The list of post types in the settings page now also shows the non-public post types that are not built in on WordPress, #677;
* CHANGED: Remove the X and Facebook icons from the footer in the admin pages, #667;
* CHANGED: Updated the URLs on the plugin's footer, #667;
* CHANGED: Minor change in the description of the setting that controls the activation/deactivation future action for the post type;
* CHANGED: The metadata `_expiration-date-status` now can be specified as `1` or `'1'` and not only `'saved'`, #69;
* CHANGED: The action `publishpress_future/run_workflow` is now depreacated in favor of `publishpressfuture_run_workflow`;
* CHANGED: When metadata support is enabled, a future action enabled is recognized by the presence of the date metadata field, ignoring the status field, #69;
* CHANGED: Added support for other date formats in the date metadata field, not only unix timestamp, #69;
* CHANGED: Minor changes to the layout of some settings pages;
* CHANGED: Change the default settings tab to "Post Types" instead of "General";
* CHANGED: Change the links and items in the footer on the plugin's admin pages, #667;
* FIXED: Fix language files for ES, IT, FR, #665;
* FIXED: Fix error when a term does not exists, #675;
* FIXED: Add new interface for NoticeFacade: NoticeInterface;
* FIXED: Fatal error: Delcarations of PostStatusToCustomStatus::getLabel() must be compatible with the interface, #674;
* REMOVED: Remove the legacy action `postExpiratorExpire`. This action will not trigger the future actions anymore;
* REMOVED: Remove the legacy action `publishpressfuture_expire`. This action will not trigger the future actions anymore;

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
