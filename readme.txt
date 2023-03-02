=== PublishPress Future: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins
Author: publishpress
Author URI: https://publishpress.com
Tags: expire posts, update posts, schedule changes, automatic changes, 
Requires at least: 5.3
Tested up to: 6.1
Stable tag: 2.9.2

Add an expiration date to posts. When your post is automatically unpublished, you can delete the post, change the status, or update the post categories.

== Description ==

The PublishPress Future plugin allows you to make automatic changes to posts. pages and other content types. On a date you choose, PublishPree Future can delete your post, change the status, or update the post categories, or make other changes.

Here's an overview of what you can do with PublishPress Future:

* Choose expiry dates for content in any post type.
* Select expiry dates in the right sidebar when editing posts.
* Modify, remove or completely delete content when the expiry date arrives.
* Modify expiry dates using "Quick Edit" and "Bulk Edit".
* Receive email notifications when your content expires.
* Show expiry dates in your content, automatically or with shortcodes.

> <strong>Upgrade to PublishPress Future Pro</strong><br />
> This plugin is the free version of the PublishPress Future plugin. The Pro version comes with all the features you need to schedule changes to your WordPresss content. <a href="https://publishpress.com/future"  title="PublishPress Future Pro">Click here to purchase the best premium WordPress content update plugin now!</a>

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
* Move the post to a custom status (Pro version)

[Click here for more details on scheduling post changes](https://publishpress.com/knowledge-base/ways-to-expire-posts/).

## Display the Action Date in Your Content

PublishPress Future allows you to place automatically show the expiry or action date inside your articles. The date will be added at the bottom of your post.

[Click here to see the Footer Display options](https://publishpress.com/knowledge-base/footer-display/).

You can use shortcodes to show the expiration date inside your posts. You can customize the shortcode output with several formatting options.

[Click here to see the shortcode options](https://publishpress.com/knowledge-base/shortcodes-to-show-expiration-date/).

## Expiry Defaults for Post Types

PublishPress Future can support any post type in WordPress. Go to Settings > PublishPress Future > Defaults and you can choose default expiry options for each post type.

[Click here to see the default options](https://publishpress.com/knowledge-base/defaults-for-post-types/).

## PublishPress Future Email Notifications

The PublishPress Future plugin can send you email notifications when your content is changed. You can control the emails by going to Settings > PublishPress Future > General Settings.

[Click here to see the notification options](https://publishpress.com/knowledge-base/email-notifications/).

## Details on How Post Changes Works

For each expiration event, a custom cron job is scheduled. This can help reduce server overhead for busy sites. This plugin REQUIRES that WP-CRON is setup and functional on your webhost.  Some hosts do not support this, so please check and confirm if you run into issues using the plugin.

[Click here to see the technical details for this plugin](https://publishpress.com/knowledge-base/scheduling-cron-jobs/).

## Logs for All Your Post Changes 

PublishPress Future Pro allows you to keep a detailed record of all the changes that happen to your posts. PublishPress Future records several key data points for all actions:

* The post that the action was performed on.
* Details of the change made to the post.
* When the change was made to the post.

[Click here to see more about the logs feature](https://publishpress.com/knowledge-base/action-logs/).

## Join PublishPress and get the Pro plugins ##

The Pro versions of the PublishPress plugins are well worth your investment. The Pro versions have extra features and faster support. [Click here to join PublishPress](https://publishpress.com/pricing/).

Join PublishPress and you'll get access to these Pro plugins:

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

= [2.9.2] - 28 Feb, 2023 =

* FIXED: List of actions in the post type settings is not filtered by post types, #400;
* FIXED: Include Statuses as a Default option, #395;
* FIXED: Remove legacy screenshots from the plugin root dir;
* FIXED: Fix i18n issues, #401;

= [2.9.1] - 23 Feb, 2023 =

* FIXED: Fix location of wordpress-banners style CSS when started by the Pro plugin, #393;

= [2.9.0] - 23 Feb, 2023 =

* ADDED: Add new filter for filtering the expiration actions list: publishpressfuture_expiration_actions;
* ADDED: Add new constant PUBLISHPRESS_FUTURE_BASE_PATH to define the base path of the plugin;
* ADDED: Added hooks to extend settings screen;
* ADDED: Added ads and banners for the Pro plugin;
* CHANGED: Refactored the UI for the Post Types settings screen closing the fields if not activated, #335, #378;
* CHANGED: Refactored the services container to be used by the Pro plugin;
* CHANGED: Changed the order of some settings field in the Post Types settings screen;
* FIXED: Fix hook transition_post_status running twice, #337;
* FIXED: Fix bug with choosing a taxonomy change as a default, #335;
* FIXED: Updated FR and IT translations, #336 (thanks to @wocmultimedia);
* FIXED: HTML escaping for a field on the settings screen;
* FIXED: Fix the expiration date column date format;
* FIXED: Fix option to clear data on uninstall, removing the debug table;

= [2.8.3] - 10 Jan, 2023 =

* ADDED: Add new filters for allowing customizing the expiration metabox and the email sent when post is expired, #327 (thanks to Menno);
* CHANGED: Changed pattern of expiration debug log messages to describe the action in a clearer way and add more details;
* CHANGED: Changed the label and description of the setting field for default date and time expiration offset, #310;
* FIXED: Remove debug statement, #326;
* FIXED: Fix text for default date/time expiration setting description;
* FIXED: Fix PHP 8 error and remove extract functions, #328;
* FIXED: Simplify setting to set default expiration date/time interval, removing invalid "none" option, #325;
* FIXED: Simplify unscheduling removing duplicated code, #329;
* FIXED: Fix PHP warning and fatal error when post's expiration categories list is not an array, #330;

= [2.8.2] - 20 Dec, 2022 =

* FIXED: Fix taxonomy expiration, #309;
* FIXED: Fix TypeError in ExpirablePostModel.php: array_unique(): Argument #1 ($array) must be of type array, #318;

= [2.8.1] - 08 Dec, 2022 =

* FIXED: Fix PHP warning: attempt to read property "ID" on null in the "the_content" filter, #313;
* FIXED: Fix PHP warning: undefined array key "properties" in class-wp-rest-meta-fields.php, #311;
* FIXED: Update language files to ES, FR and IT (thanks to @wocmultimedia), #308;

= [2.8.0] - 08 Nov, 2022 =

* ADDED: Add translations for ES, FR, IT languages, #297;
* CHANGED: Removed the "None" option from default expiration dates. If a site is using it, the default value is now "Custom" and set for "+1 week", #274;
* CHANGED: The code was partially refactored improving the code quality, applying DRY and other good practices;
* CHANGED: Deprecated some internal functions: postexpirator_activate, postexpirator_autoload, postexpirator_schedule_event, postexpirator_unschedule_event, postexpirator_debug, _postexpirator_get_cat_names, postexpirator_register_expiration_meta, postexpirator_expire_post, expirationdate_deactivate;
* CHANGED: Deprecated the constant: PostExpirator_Facade::PostExpirator_Facade => PublishPressFuture\Modules\Expirator\CapabilitiesAbstract::EXPIRE_POST;
* CHANGED: Deprecated the constant POSTEXPIRATOR_DEBUG;
* CHANGED: Deprecated the method PostExpirator_Facade::set_expire_principles;
* CHANGED: Deprecated the method PostExpirator_Facade::current_user_can_expire_posts;
* CHANGED: Deprecated the method PostExpirator_Facade::get_default_expiry;
* CHANGED: Deprecated the method PostExpirator_Util::get_wp_date;
* CHANGED: Deprecated the class PostExpiratorDebug;
* CHANGED: Deprecated the constants: POSTEXPIRATOR_VERSION, POSTEXPIRATOR_DATEFORMAT, POSTEXPIRATOR_TIMEFORMAT, POSTEXPIRATOR_FOOTERCONTENTS, POSTEXPIRATOR_FOOTERSTYLE, POSTEXPIRATOR_FOOTERDISPLAY, POSTEXPIRATOR_EMAILNOTIFICATION, POSTEXPIRATOR_EMAILNOTIFICATIONADMINS, POSTEXPIRATOR_DEBUGDEFAULT, POSTEXPIRATOR_EXPIREDEFAULT, POSTEXPIRATOR_SLUG, POSTEXPIRATOR_BASEDIR, POSTEXPIRATOR_BASENAME, POSTEXPIRATOR_BASEURL, POSTEXPIRATOR_LOADED, POSTEXPIRATOR_LEGACYDIR;
* FIXED: Fix the expire date column in WooCommerce products list, #276;
* FIXED: Improve output escaping on a few views, #235;
* FIXED: Improve input sanitization, #235;
* FIXED: Add argument swapping on strings with multiple arguments, #305;
* FIXED: Expiration settings not working on Classic Editor, #274;
* FIXED: Fixed remaining message "Cron event not found!" for expirations that run successfully, #288;

= [2.7.8] - 17 Oct, 2022 =

* CHANGED: Rename "Category" in the expiration options to use a more generic term: "Taxonomy";
* CHANGED: Fixed typo in the classical metabox (classical editor);
* FIXED: Fix bulk edit when expiration is not enabled for the post type, #281;
* FIXED: Fix custom taxonomies support, #50;

= [2.7.7] - 14 Jul, 2022 =

* ADDED: Add post meta "expiration_log" with expiration log data when post expires;
* FIXED: Can't bulk edit posts if hour or minutes are set to 00, #273;
* FIXED: When the post expires to draft we don't trigger the status transition actions, #264;

= [2.7.6] - 13 Jun, 2022 =

* FIXED: Fix fatal error on cron if debug is not activated, #265;

= [2.7.5] - 09 Jun, 2022 =

* FIXED: Fix undefined array key "hook_suffix" warning, #259;
* FIXED: Double email sending bug confirmed bug, #204;

= [2.7.4] - 07 Jun, 2022 =

* CHANGED: Add library to protect breaking site when multiple instances of the plugin are activated;
* CHANGED: Invert order of the debug log, showing now on ASC order;
* CHANGED: Make bulk edit date fields required, #256;
* FIXED: Fix unlocalized string on the taxonomy field (Thanks to Alex Lion), #255;
* FIXED: Fix default taxonomy selection for Post Types in the settings, #144;
* FIXED: Fix typo in the hook name 'postexpirator_schedule' (Thanks to Nico Mollet), #244;
* FIXED: Fix bulk editing for WordPress v6.0, #251;
* FIXED: Fix the Gutenberg panel for custom post types created on PODS in WordPress v6.0, #250;

= [2.7.3] - 27 Jan 2022 =

* FIXED: Fix the selection of categories when setting a post to expire, #220;

= [2.7.2] - 25 Jan 2022 =

* ADDED: Added the event GUID as tooltip to each post in the Current Cron Schedule list on the Diagnostics page, #214;
* CHANGED: Added more clear debug message if the cron event was not scheduled due to an error;
* CHANGED: Refactored the list of cron schedules in the Diagnostics tab adding more post information, #215;
* CHANGED: Removed the admin notice about the plugin renaming;
* FIXED: Fix the Expires column in the posts page correctly identifying the post ID on cron event with multiple IDs, #210;
* FIXED: Fix wrong function used to escape a html attributes on a setting page;
* FIXED: Fix missed sanitization for some data on admin pages;
* FIXED: Fix some false positives given by PHPCS;
* FIXED: Fix expiration data processing avoid to process for deactivated posts;
* FIXED: Fix a typo in the diagnostics settings tab;
* FIXED: Fix the checkbox state for posts that are not set to expire, #217;

= [2.7.1] - 12 Jan 2022 =

* ADDED: Add visual indicator to the cron event status in the settings page, #155;
* ADDED: Add small help text to the Expires column icon to say if the event is scheduled or not;
* ADDED: Add additional permission check before loading the settings page;
* ADDED: Add CLI command to expire a post, #206;
* CHANGED: Remove the plugin description from the settings page, #194;
* CHANGED: Deprecated a not used function called "expirationdate_get_blog_url";
* CHANGED: Updated the min required WP to 5.3 due to the requirement of using the function 'wp_date';
* FIXED: Fix PHP error while purging the debug log, #135;
* FIXED: Fix composer's autoloader path;
* FIXED: Code cleanup. Removed comments and dead code;
* FIXED: Fixed the block for direct access to view files;
* FIXED: Added check for is_admin before checking if the user has permission to see the settings page;
* FIXED: Avoid running sortable column code if not in the admin;
* FIXED: Cross-site scripting (XSS) was possible if a third party allowed html or javascript into a database setting or language file;
* FIXED: Fix the URL for the View Debug Log admin page, #196;
* FIXED: Removed unopened span tag from a form;
* FIXED: Added a secondary admin and ajax referer check when saving expiration post data;
* FIXED: Fix the option "Preserve data after deactivating the plugin" that was not saving the setting, #198;
* FIXED: Fix the post expiration function to make sure a post is not expired if the checkbox is not checked on it, #199;
* FIXED: Fix the post expiration meta not being cleanup after a post expires, #207;
* FIXED: Fix the post expiration checkbox status when post type is set configured to check it by default;

= [2.7.0] - 02 Dec 2021 =

* ADDED: Add new admin menu item: Future, #8;
* CHANGED: Rename the plugin from Post Expirator to PublishPress Future, #14;
* CHANGED: Add the PublishPress footer and branding, #68;
* CHANGED: Separate the settings into different tabs, #97, #98;
* CHANGED: Rename the "General Settings" tab to "Default", #99;
* FIXED: Fix the 1hr diff between expiration time when editing and shown in post list, #138;
* FIXED: Post Expirator is adding wrong expiry dates to old posts, #160;
* FIXED: Post Expirator is setting unwanted expire time for posts, #187;

= [2.6.3] - 18 Nov 2021 =

* ADDED: Add setting field for choosing between preserve or delete data when the plugin is deactivated, #137;
* FIXED: Fix the timezone applied to time fields, #134;
* FIXED: Add the timezone string to the time fields, #134;
* FIXED: Fix the selected expiring categories on the quick edit panel, #160;
* FIXED: Fix E_COMPILER_ERROR when cleaning up the debug table, #183;
* FIXED: Fix translation and localization of date and time, #150;

= [2.6.2] - 04 Nov 2021 =

* FIXED: Fix fatal error: Call to a member function add_cap() on null, #167;
* FIXED: Fix hierarchical taxonomy selection error for multiple taxonomies, #144;
* FIXED: Fix PHP warning: use of undefined constant - assumed 'expireType', #617;
* FIXED: Fix translation of strings in the block editor panel, #163;
* FIXED: Fix category not being added or removed when the post expires, #170;
* FIXED: Fix PHP notice: Undefined variable: merged, #174;
* FIXED: Fix category-based expiration for custom post types in classic editor, #179;
* FIXED: Fix expiration date being added to old posts when edited, #168;

= [2.6.1] - 27 Oct 2021 =

* ADDED: Add post information to the scheduled list for easier debugging, #164;
* ADDED: Add a review request after a specific period of usage, #103;
* ADDED: Improve the list of cron tasks, filtering only the tasks related to the plugin, #153;
* FIXED: Fix category replace not saving, #159;
* FIXED: Fix auto enabled settings, #158;
* FIXED: Fix expiration data and cron on Gutenberg style box, #156, #136;
* FIXED: Fix the request that loads categories in the Gutenberg style panel, #133;
* FIXED: Fix the category replace not working with the new Gutenberg style panel, #127;
* FIXED: Fix the default options for the Gutenberg style panel, #145;

= [2.6.0] - 04 Oct 2021 =

* ADDED: Add specific capabilities for expiring posts, #141;

= [2.5.1] - 27 Sep 2021 =

* FIXED: Default Expiration Categories cannot be unset, #94;
* FIXED: Tidy up design for Classic Editor version, #83;
* FIXED: All posts now carry the default expiration, #115;
* FIXED: Error with 2.5.0 and WordPress 5.8.1, #110;
* FIXED: Do not show private post types that don't have an admin UI, #116;

= [2.5.0] - 08 Aug 2021 =

* ADDED: Add "How to Expire" to Quick Edit, #62;
* ADDED: Support for Gutenberg block editor, #10;
* ADDED: Set a default time per post type, #12;
* CHANGED: Settings UI enhancement, #14;
* FIXED: Appearance Widgets screen shows PHP Notice, #92;
* FIXED: Stop the PublishPress Future box from appearing in non-public post types, #78;
* FIXED: Hide metabox from Media Library files, #56;

= [2.4.4] - 22 Jul 2021 =

* FIXED: Fix conflict with the plugin WCFM, #60;
* FIXED: Fix the Category: Remove option, #61;

= [2.4.3] - 07 Jul 2021 =

* ADDED: Expose wrappers for legacy functions, #40;
* ADDED: Support for quotes in Default expiry, #43;
* CHANGED: Bulk and Quick Edit boxes default to current date/year, #46;
* FIXED: Default expiry duration is broken for future years, #39;
* FIXED: Translation bug, #5;
* FIXED: Post expiring one year early, #24;

= [2.4.2] =

* FIXED: Bulk edit does not change scheduled event bug, #29;
* FIXED: Date not being translated in shortcode, #16;
* FIXED: Bulk Edit doesn't work, #4;

= [2.4.1] =

* FIXED: Updated deprecated .live jQuery reference;
* FIXED: Updated deprecated .live jQuery reference;

= [2.4.0] =

* FIXED: Fixed PHP Error with PHP 7;
* FIXED: Fixed PHP Error with PHP 7;

= [2.3.1] =

* FIXED: Fixed PHP Error that snuck in on some installations;
* FIXED: Fixed PHP Error that snuck in on some installations;

= [2.3.0] =

* ADDED: Email notification upon post expiration.  A global email can be set, blog admins can be selected and/or specific users based on post type can be notified;
* ADDED: Email notification upon post expiration.  A global email can be set, blog admins can be selected and/or specific users based on post type can be notified;
* ADDED: Expiration Option Added - Stick/Unstick post is now available;
* ADDED: Expiration Option Added - Stick/Unstick post is now available;
* ADDED: Expiration Option Added - Trash post is now available;
* ADDED: Expiration Option Added - Trash post is now available;
* ADDED: Added custom actions that can be hooked into when expiration events are scheduled / unscheduled;
* ADDED: Added custom actions that can be hooked into when expiration events are scheduled / unscheduled;
* FIXED: Minor HTML Code Issues;

= [2.2.2] =

* FIXED: Quick Edit did not retain the expire type setting, and defaulted back to "Draft".  This has been resolved;
* FIXED: Quick Edit did not retain the expire type setting, and defaulted back to "Draft".  This has been resolved;

= [2.2.1] =

* FIXED: Fixed issue with bulk edit not correctly updating the expiration date;
* FIXED: Fixed issue with bulk edit not correctly updating the expiration date;

= [2.2.0] =

* ADDED: Quick Edit - setting expiration date and toggling post expiration status can now be done via quick edit;
* ADDED: Quick Edit - setting expiration date and toggling post expiration status can now be done via quick edit;
* ADDED: Bulk Edit - changing expiration date on posts that already are configured can now be done via bulk edit;
* ADDED: Bulk Edit - changing expiration date on posts that already are configured can now be done via bulk edit;
* ADDED: Added ability to order by Expiration Date in dashboard;
* ADDED: Added ability to order by Expiration Date in dashboard;
* ADDED: Adjusted formatting on defaults page.  Multiple post types are now displayed cleaner;
* ADDED: Adjusted formatting on defaults page.  Multiple post types are now displayed cleaner;
* FIXED: Minor Code Cleanup;

= [2.1.4] =

* FIXED: PHP Strict errors with 5.4+;
* FIXED: Removed temporary timezone conversion - now using core functions again;

= [2.1.3] =

* FIXED: Default category selection now saves correctly on default settings screen;

= [2.1.2] =

* ADDED: Added check to show if WP_CRON is enabled on diagnostics page;
* FIXED: Minor Code Cleanup;
* SECURITY: Added form nonce for protect against possible CSRF;
* SECURITY: Fixed XSS issue on settings pages;

= [2.1.1] =

* ADDED: Added the option to disable post expirator for certain post types if desired;
* FIXED: Fixed php warning issue cause when post type defaults are not set;

= [2.1.0] =

* ADDED: Added support for hierarchical custom taxonomy;
* ADDED: Enhanced custom post type support;
* FIXED: Updated debug function to be friendly for scripted calls;
* FIXED: Change to only show public custom post types on defaults screen;
* FIXED: Removed category expiration options for 'pages', which is currently unsupported;
* FIXED: Some date calls were getting "double" converted for the timezone pending how other plugins handled date - this issue should now be resolved;

= [2.0.1] =

* CHANGED: Old option cleanup;
* REMOVED: Removes old scheduled hook - this was not done completely in the 2.0.0 upgrade;

= [2.0.0] =

* ADDED: Improved debug calls and logging;
* ADDED: Added the ability to expire to a "private" post;
* ADDED: Added the ability to expire by adding or removing categories.  The old way of doing things is now known as replacing categories;
* ADDED: Revamped the expiration process - the plugin no longer runs on an minute, hourly, or other schedule.  Each expiration event schedules a unique event to run, conserving system resources and making things more efficient;
* ADDED: The type of expiration event can be selected for each post, directly from the post editing screen;
* ADDED: Ability to set defaults for each post type (including custom posts);
* ADDED: Renamed expiration-date meta value to _expiration-date;
* ADDED: Revamped timezone handling to be more correct with WordPress standards and fix conflicts with other plugins;
* ADDED: 'Expires' column on post display table now uses the default date/time formats set for the blog;
* FIXED: Removed kses filter calls when then schedule task runs that was causing code entered as unfiltered_html to be removed;
* FIXED: Updated some calls of date to now use date_i18n;
* FIXED: Most (if not all) php error/warnings should be addressed;
* FIXED: Updated wpdb calls in the debug class to use wpdb_prepare correctly;
* FIXED: Changed menu capability option from "edit_plugin" to "manage_options";

RELEASE NOTE: This is a major update of the core functions of this plugin.  All current plugins and settings should be upgraded to the new formats and work as expected.  Any posts currently schedule to be expirated in the future will be automatically upgraded to the new format.

= [1.6.2] =

* ADDED: Added the ability to configure the post expirator to be enabled by default for all new posts;
* CHANGED: some instances of mktime to time;
* FIXED: Fixed missing global call for MS installs;

= [1.6.1] =

* ADDED: Added option to allow user to select any cron schedule (minute, hourly, twicedaily, daily) - including other defined schedules;
* ADDED: Added option to set default expiration duration - options are none, custom, or publish time;
* FIXED: Tweaked error messages, removed clicks for reset cron event;
* FIXED: Switched cron schedule functions to use "current_time('timestamp')";
* FIXED: Cleaned up default values code;
* FIXED: Code cleanup - php notice;

= [1.6] =

* ADDED: Added debugging;
* CHANGED: Replaced "Upgrade" tab with new "Diagnostics" tab;
* CHANGED: Various code cleanup;
* FIXED: Fixed invalid html;
* FIXED: Fixed i18n issues with dates;
* FIXED: Fixed problem when using "Network Activate" - reworked plugin activation process;
* FIXED: Reworked expire logic to limit the number of sql queries needed;

= [1.5.4] =

* CHANGED: Cleaned up deprecated function calls;

= [1.5.3] =

* FIXED: Fixed bug with sql expiration query (props to Robert & John);

= [1.5.2] =

* FIXED: Fixed bug with shortcode that was displaying the expiration date in the incorrect timezone;
* FIXED: Fixed typo on settings page with incorrect shortcode name;

= [1.5.1] =

* FIXED: Fixed bug that was not allow custom post types to work;

= [1.5] =

* CHANGED: Moved Expirator Box to Sidebar and cleaned up meta code;
* ADDED: Added ability to expire post to category;

= [1.4.3] =

* FIXED: Fixed issue with 3.0 multisite detection;

= [1.4.2] =

* ADDED: Added post expirator POT to /languages folder;
* FIXED: Fixed issue with plugin admin navigation;
* FIXED: Fixed timezone issue on plugin options screen;

= [1.4.1] =

* ADDED: Added support for custom post types (Thanks Thierry);
* ADDED: Added i18n support (Thanks Thierry);
* FIXED: Fixed issue where expiration date was not shown in the correct timezone in the footer;
* FIXED: Fixed issue where on some systems the expiration did not happen when scheduled;

= [1.4] =

* FIXED: Fixed compatability issues with Wordpress - plugin was originally coded for WPMU - should now work on both;
* ADDED: Added ability to schedule post expiration by minute;
* FIXED: Fixed timezone - now uses the same timezone as configured by the blog;

RELEASE NOTE: After upgrading, you may need to reset the cron schedules.  Following onscreen notice if prompted.  Previously scheduled posts will not be updated, they will be deleted referncing the old timezone setting.  If you wish to update them, you will need to manually update the expiration time.

= [1.3.1] =

* FIXED: Fixed sporadic issue of expired posts not being removed;

= [1.3] =

* FIXED: Expiration date is now retained across all post status changes;
* FIXED: Modified date/time format options for shortcode postexpirator tag;
* ADDED: Added the ability to add text automatically to the post footer if expiration date is set;

= [1.2.1] =

* FIXED: Fixed issue with display date format not being recognized after upgrade;

= [1.2] =

* CHANGED: wording from "Expiration Date" to "Post Expirator" and moved the configuration options to the "Settings" tab;
* CHANGED: wording from "Expiration Date" to "Post Expirator" and moved the configuration options to the "Settings" tab;
* ADDED: Added shortcode tag [postexpirator] to display the post expiration date within the post;
* ADDED: Added new setting for the default format;
* FIXED: Fixed bug where expiration date was removed when a post was auto saved;

= [1.1] =

* FIXED: Expired posts retain expiration date;

= [1.0] =

* ADDED: The initial release;
