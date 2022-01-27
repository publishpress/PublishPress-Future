=== PublishPress Future: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins, rozroz
Author: publishpress
Author URI: https://publishpress.com
Tags: expire, posts, pages, schedule
Requires at least: 5.3
Tested up to: 5.9
Stable tag: 2.7.3

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

= [2.7.3] - 27 Jan 2022 =

* Fixed: Fix the selection of categories when setting a post to expire, #220;

= [2.7.2] - 25 Jan 2022 =

* Changed: Added more clear debug message if the cron event was not scheduled due to an error;
* Changed: Refactored the list of cron schedules in the Diagnostics tab adding more post information, #215;
* Changed: Removed the admin notice about the plugin renaming;
* Added: Added the event GUID as tooltip to each post in the Current Cron Schedule list on the Diagnostics page, #214;
* Fixed: Fix the Expires column in the posts page correctly identifying the post ID on cron event with multiple IDs, #210;
* Fixed: Fix wrong function used to escape a html attributes on a setting page;
* Fixed: Fix missed sanitization for some data on admin pages;
* Fixed: Fix some false positives given by PHPCS;
* Fixed: Fix expiration data processing avoid to process for deactivated posts;
* Fixed: Fix a typo in the diagnostics settings tab;
* Fixed: Fix the checkbox state for posts that are not set to expire, #217;

= [2.7.1] - 12 Jan 2022 =

* Added: Add visual indicator to the cron event status in the settings page, #155;
* Added: Add small help text to the Expires column icon to say if the event is scheduled or not;
* Added: Add additional permission check before loading the settings page;
* Added: Add CLI command to expire a post, #206;
* Changed: Remove the plugin description from the settings page, #194;
* Changed: Deprecated a not used function called "expirationdate_get_blog_url";
* Changed: Updated the min required WP to 5.3 due to the requirement of using the function 'wp_date';
* Fixed: Fix PHP error while purging the debug log, #135;
* Fixed: Fix composer's autoloader path;
* Fixed: Code cleanup. Removed comments and dead code;
* Fixed: Fixed the block for direct access to view files;
* Fixed: Added check for is_admin before checking if the user has permission to see the settings page;
* Fixed: Avoid running sortable column code if not in the admin;
* Fixed: Cross-site scripting (XSS) was possible if a third party allowed html or javascript into a database setting or language file;
* Fixed: Fix the URL for the View Debug Log admin page, #196;
* Fixed: Removed unopened span tag from a form;
* Fixed: Added a secondary admin and ajax referer check when saving expiration post data;
* Fixed: Fix the option "Preserve data after deactivating the plugin" that was not saving the setting, #198;
* Fixed: Fix the post expiration function to make sure a post is not expired if the checkbox is not checked on it, #199;
* Fixed: Fix the post expiration meta not being cleanup after a post expires, #207;
* Fixed: Fix the post expiration checkbox status when post type is set configured to check it by default;

= [2.7.0] - 02 Dec 2021 =

* Changed: Rename the plugin from Post Expirator to PublishPress Future, #14;
* Changed: Add the PublishPress footer and branding, #68;
* Changed: Separate the settings into different tabs, #97, #98;
* Changed: Rename the "General Settings" tab to "Default", #99;
* Added: Add new admin menu item: Future, #8;
* Fixed: Fix the 1hr diff between expiration time when editing and shown in post list, #138;
* Fixed: Post Expirator is adding wrong expiry dates to old posts, #160;
* Fixed: Post Expirator is setting unwanted expire time for posts, #187;

= [2.6.3] - 18 Nov 2021 =

* Fixed: Fix the timezone applied to time fields, #134;
* Fixed: Add the timezone string to the time fields, #134;
* Fixed: Fix the selected expiring categories on the quick edit panel, #160;
* Added: Add setting field for choosing between preserve or delete data when the plugin is deactivated, #137;
* Fixed: Fix E_COMPILER_ERROR when cleaning up the debug table, #183;
* Fixed: Fix translation and localization of date and time, #150;

= [2.6.2] - 04 Nov 2021 =

* Fixed: Fix fatal error: Call to a member function add_cap() on null, #167;
* Fixed: Fix hierarchical taxonomy selection error for multiple taxonomies, #144;
* Fixed: Fix PHP warning: use of undefined constant - assumed 'expireType', #617;
* Fixed: Fix translation of strings in the block editor panel, #163;
* Fixed: Fix category not being added or removed when the post expires, #170;
* Fixed: Fix PHP notice: Undefined variable: merged, #174;
* Fixed: Fix category-based expiration for custom post types in classic editor, #179;
* Fixed: Fix expiration date being added to old posts when edited, #168;

= [2.6.1] - 27 Oct 2021 =

* Fixed: Fix category replace not saving, #159;
* Fixed: Fix auto enabled settings, #158;
* Fixed: Fix expiration data and cron on Gutenberg style box, #156, #136;
* Fixed: Fix the request that loads categories in the Gutenberg style panel, #133;
* Fixed: Fix the category replace not working with the new Gutenberg style panel, #127;
* Fixed: Fix the default options for the Gutenberg style panel, #145;
* Added: Add post information to the scheduled list for easier debugging, #164;
* Added: Add a review request after a specific period of usage, #103;
* Added: Improve the list of cron tasks, filtering only the tasks related to the plugin, #153;

= [2.6.0] - 04 Oct 2021 =

* Added: Add specific capabilities for expiring posts, #141;

= [2.5.1] - 27 Sep 2021 =

* Fixed: Default Expiration Categories cannot be unset, #94;
* Fixed: Tidy up design for Classic Editor version, #83;
* Fixed: All posts now carry the default expiration, #115;
* Fixed: Error with 2.5.0 and WordPress 5.8.1, #110;
* Fixed: Do not show private post types that don't have an admin UI, #116;

= [2.5.0] - 08 Aug 2021 =

* Fixed: Appearance Widgets screen shows PHP Notice, #92;
* Fixed: Stop the PublishPress Future box from appearing in non-public post types, #78;
* Added: Add "How to Expire" to Quick Edit, #62;
* Changed: Settings UI enhancement, #14;
* Fixed: Hide metabox from Media Library files, #56;
* Added: Support for Gutenberg block editor, #10;
* Added: Set a default time per post type, #12;


= [2.4.4] - 22 Jul 2021 =

* Fixed: Fix conflict with the plugin WCFM, #60;
* Fixed: Fix the Category: Remove option, #61;

= [2.4.3] - 07 Jul 2021 =

* Added: Expose wrappers for legacy functions, #40;
* Added: Support for quotes in Default expiry, #43;
* Fixed: Default expiry duration is broken for future years, #39;
* Fixed: Translation bug, #5;
* Fixed: Post expiring one year early, #24;
* Changed: Bulk and Quick Edit boxes default to current date/year, #46;

= [2.4.2] =

* Fixed: Bulk edit does not change scheduled event bug, #29;
* Fixed: Date not being translated in shortcode, #16;
* Fixed: Bulk Edit doesn't work, #4;

= [2.4.1] =

* Fix: Updated deprecated .live jQuery reference.

= [2.4.0] =

* Fix: Fixed PHP Error with PHP 7.

= [2.3.1] =

* Fix: Fixed PHP Error that snuck in on some installations.

= [2.3.0] =

* New: Email notification upon post expiration.  A global email can be set, blog admins can be selected and/or specific users based on post type can be notified.
* New: Expiration Option Added - Stick/Unstick post is now available.
* New: Expiration Option Added - Trash post is now available.
* New: Added custom actions that can be hooked into when expiration events are scheduled / unscheduled.
* Fix: Minor HTML Code Issues

= [2.2.2] =

* Fix: Quick Edit did not retain the expire type setting, and defaulted back to "Draft".  This has been resolved.

= [2.2.1] =

* Fix: Fixed issue with bulk edit not correctly updating the expiration date.

= [2.2.0] =

* New: Quick Edit - setting expiration date and toggling post expiration status can now be done via quick edit.
* New: Bulk Edit - changing expiration date on posts that already are configured can now be done via bulk edit.
* New: Added ability to order by Expiration Date in dashboard.
* New: Adjusted formatting on defaults page.  Multiple post types are now displayed cleaner.
* Fix: Minor Code Cleanup

= [2.1.4] =

* Fix: PHP Strict errors with 5.4+
* Fix: Removed temporary timezone conversion - now using core functions again

= [2.1.3] =

* Fix: Default category selection now saves correctly on default settings screen

= [2.1.2] =

* Security: Added form nonce for protect against possible CSRF
* Security: Fixed XSS issue on settings pages
* New: Added check to show if WP_CRON is enabled on diagnostics page
* Fix: Minor Code Cleanup

= [2.1.1] =

* New: Added the option to disable post expirator for certain post types if desired
* Fix: Fixed php warning issue cause when post type defaults are not set

= [2.1.0] =

* New: Added support for hierarchical custom taxonomy
* New: Enhanced custom post type support
* Fix: Updated debug function to be friendly for scripted calls
* Fix: Change to only show public custom post types on defaults screen
* Fix: Removed category expiration options for 'pages', which is currently unsupported
* Fix: Some date calls were getting "double" converted for the timezone pending how other plugins handled date - this issue should now be resolved

= [2.0.1] =

* Removes old scheduled hook - this was not done completely in the 2.0.0 upgrade
* Old option cleanup

= [2.0.0] =

This is a major update of the core functions of this plugin.  All current plugins and settings should be upgraded to the new formats and work as expected.  Any posts currently schedule to be expirated in the future will be automatically upgraded to the new format.

* New: Improved debug calls and logging
* New: Added the ability to expire to a "private" post
* New: Added the ability to expire by adding or removing categories.  The old way of doing things is now known as replacing categories
* New: Revamped the expiration process - the plugin no longer runs on an minute, hourly, or other schedule.  Each expiration event schedules a unique event to run, conserving system resources and making things more efficient
* New: The type of expiration event can be selected for each post, directly from the post editing screen
* New: Ability to set defaults for each post type (including custom posts)
* New: Renamed expiration-date meta value to _expiration-date
* New: Revamped timezone handling to be more correct with WordPress standards and fix conflicts with other plugins
* New: 'Expires' column on post display table now uses the default date/time formats set for the blog
* Fix: Removed kses filter calls when then schedule task runs that was causing code entered as unfiltered_html to be removed
* Fix: Updated some calls of date to now use date_i18n
* Fix: Most (if not all) php error/warnings should be addressed
* Fix: Updated wpdb calls in the debug class to use wpdb_prepare correctly
* Fix: Changed menu capability option from "edit_plugin" to "manage_options"

= [1.6.2] =

* Added the ability to configure the post expirator to be enabled by default for all new posts
* Changed some instances of mktime to time
* Fixed missing global call for MS installs

= [1.6.1] =

* Tweaked error messages, removed clicks for reset cron event
* Switched cron schedule functions to use "current_time('timestamp')"
* Cleaned up default values code
* Added option to allow user to select any cron schedule (minute, hourly, twicedaily, daily) - including other defined schedules
* Added option to set default expiration duration - options are none, custom, or publish time
* Code cleanup - php notice

= [1.6] =

* Fixed invalid html
* Fixed i18n issues with dates
* Fixed problem when using "Network Activate" - reworked plugin activation process
* Replaced "Upgrade" tab with new "Diagnostics" tab
* Reworked expire logic to limit the number of sql queries needed
* Added debugging
* Various code cleanup

= [1.5.4] =

* Cleaned up deprecated function calls

= [1.5.3] =

* Fixed bug with sql expiration query (props to Robert & John)

= [1.5.2] =

* Fixed bug with shortcode that was displaying the expiration date in the incorrect timezone
* Fixed typo on settings page with incorrect shortcode name

= [1.5.1] =

* Fixed bug that was not allow custom post types to work

= [1.5] =

* Moved Expirator Box to Sidebar and cleaned up meta code
* Added ability to expire post to category

= [1.4.3] =

* Fixed issue with 3.0 multisite detection

= [1.4.2] =

* Added post expirator POT to /languages folder
* Fixed issue with plugin admin navigation
* Fixed timezone issue on plugin options screen

= [1.4.1] =

* Added support for custom post types (Thanks Thierry)
* Added i18n support (Thanks Thierry)
* Fixed issue where expiration date was not shown in the correct timezone in the footer
* Fixed issue where on some systems the expiration did not happen when scheduled

= [1.4] =

NOTE: After upgrading, you may need to reset the cron schedules.  Following onscreen notice if prompted.  Previously scheduled posts will not be updated, they will be deleted referncing the old timezone setting.  If you wish to update them, you will need to manually update the expiration time.

* Fixed compatability issues with Wordpress - plugin was originally coded for WPMU - should now work on both
* Added ability to schedule post expiration by minute
* Fixed timezone - now uses the same timezone as configured by the blog

= [1.3.1] =

* Fixed sporadic issue of expired posts not being removed

= [1.3] =

* Expiration date is now retained across all post status changes
* Modified date/time format options for shortcode postexpirator tag
* Added the ability to add text automatically to the post footer if expiration date is set

= [1.2.1] =

* Fixed issue with display date format not being recognized after upgrade

= [1.2] =

* Changed wording from "Expiration Date" to "Post Expirator" and moved the configuration options to the "Settings" tab.
* Added shortcode tag [postexpirator] to display the post expiration date within the post
** Added new setting for the default format
* Fixed bug where expiration date was removed when a post was auto saved

= [1.1] =

* Expired posts retain expiration date

= [1.0] =

* Initial Release

== Upgrade Notice ==

= 2.2.0 =
Quick Edit/Bulk Edit Added. Sortable Expiration Date Fields Added

= 2.1.4 =
Fixed PHP Strict errors with 5.4+
Removed temporary timezone conversion functions


= 2.1.3 =
Default category selection now saves correctly on default settings screen

= 2.1.2 =
Important Update - Security Fixes - See Changelog

= 2.0.1 =
Removes old scheduled hook - this was not done completely in the 2.0.0 upgrade

= 2.0.0 =
This is a major update of the core functions of this plugin.  All current plugins and settings should be upgraded to the new formats and work as expected.  Any posts currently schedule to be expirated in the future will be automatically upgraded to the new format.

= 1.6.1 =
Tweaked error messages, added option to allow user to select cron schedule and set default exiration duration

= 1.6 =
Fixed invalid html
Fixed i18n issues with dates
Fixed problem when using "Network Activate" - reworked plugin activation process
Replaced "Upgrade" tab with new "Diagnostics" tab
Reworked expire logic to limit the number of sql queries needed
Added debugging

= 1.5.4 =
Cleaned up deprecated function calls

= 1.5.3 =
Fixed bug with sql expiration query (props to Robert & John)

= 1.5.2 =
Fixed shortcode timezone issue
