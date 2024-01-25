=== PublishPress Future: Schedule Changes to WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins
Author: publishpress
Author URI: https://publishpress.com
Tags: expire posts, update posts, schedule changes, automatic changes,
Requires at least: 6.1
Requires PHP: 7.2.5
Tested up to: 6.4
License: GPLv2 or later
Stable tag: 3.2.0

PublishPress Future can make scheduled changes to your content. You can unpublish the post, move the post to a new status, update the post categories, and much more.

== Description ==

The PublishPress Future plugin allows you to make automatic changes to posts, pages and other content types. On a date you choose, PublishPress Future can delete your post, change the status, or update the post categories, or make other changes.

Here's an overview of what you can do with PublishPress Future:

* Choose unpublish dates for your posts.
* Modify, remove or completely delete content when the expiry date arrives.
* Add or remove categories.
* Modify expiry dates using "Quick Edit" and "Bulk Edit".
* Receive email notifications when your content expires.
* Show expiry dates in your content, automatically or with shortcodes.

## PublishPress Future Pro ##

> <strong>Upgrade to PublishPress Future Pro</strong><br />
> This plugin is the free version of the PublishPress Future plugin. The Pro version comes with all the features you need to schedule changes to your WordPresss content. <a href="https://publishpress.com/future"  title="PublishPress Future Pro">Click here to purchase the best plugin for scheduling WordPress content updates!</a>

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

= [3.2.0] - 25 Jan, 2024 =

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

= [3.1.5] - 14 Dec, 2023 =

* FIXED: Fix array_map(): Argument must be of type array, string given, #606;
* FIXED: Remove broken and invalid setting to use classic metabox, #604;
* FIXED: Prevent a PHP warning in the posts screen if the selected term do not exists anymore, #612;
* FIXED: Update the ES, IT and FR translations, #609;

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

* FIXED: Fix compatibility with Composer-based installations, using prefixed libraries, #522;
* FIXED: Fix notice about using `FILTER_SANITIZE_STRING` on PHP 8, #525;
* CHANGED: Remove the file `define-base-path.php`. The constant `PUBLISHPRESS_FUTURE_BASE_PATH` is deprecated and is now defined in the main plugin file;
* CHANGED: Internal dependencies moved from `vendor` to `lib/vendor`, #522;
* CHANGED: Replaced Pimple library with a prefixed version of the library to avoid conflicts with other plugins, #522;
* CHANGED: Replaced Psr/Container library with a prefixed version of the library to avoid conflicts with other plugins, #522;
* CHANGED: Change min PHP version to 7.2.5. If not compatible, the plugin will not execute;
* CHANGED: Change min WP version to 5.5. If not compatible, the plugin will not execute;
* CHANGED: Updated internal libraries to the latest versions;
* CHANGED: Changed the priority of the hook `plugins_loaded` on the main plugin file from 10 to 5, #522;
* CHANGED: Removed the `vendor-locator-future` library. Internal vendor is now on a fixed path, `lib/vendor`, #522;
* CHANGED: Deprecated constant `PUBLISHPRESS_FUTURE_VENDOR_PATH` in favor of `PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH`;
* CHANGED: Update Action Scheduler library to 3.6.2;
* CHANGED: Update the .pot and .mo files;

= [3.0.6] - 26 Jul, 2023 =

* FIXED: Fix JavaScript error on the block editor: Uncaught TypeError: Cannot read properties of undefined (reading 'indexOf'), #517;
* FIXED: Fix fatal error on content with shortcode: Call to undefined method ...ExpirablePostModel::getExpiratigetExpirationDateAsUnixTimeonDate(), #516;

= [3.0.5] - 25 Jul, 2023 =

* ADDED: Add a setting field to control the style of the Future Action column on posts lists (Advanced tab), #482;
* FIXED: Fix the message that prevented to select terms for a future action, #488;
* FIXED: Fix the taxonomy field in the Post Types settings page, that was not visible unless you select a taxonomy related default action, #496;
* FIXED: Fix the space after the "reset" button on the calendar field, in the block editor, #465;
* FIXED: Fix error displayed when trying to deactivate the plugin with "Preserve data after deactivating the plugin" as "Delete data", #499;
* FIXED: Fix DB error when trying to create the action args table, due to DESCRIBE query on a table that do not exists yet, #450;
* FIXED: Fix default expiration date time for post type on different timezones;
* FIXED: Fix date and time on block editor with different timezones, #498;
* FIXED: Fix missed title and post type info in emails or logs when the post is deleted, #507;
* FIXED: Notice: Undefined variable: gmt_schedule_display_string, in the columns in the Future Action screens, #504;
* FIXED: Update ES, FR, and IT translations, #509;
* CHANGED: Improve the label for the terms field in the block editor panel, #483;
* CHANGED: Merge the settings tabs "Diagnostics" and "Tools", #501;
* CHANGED: Update the .pot file;
* CHANGED: Renamed the settings tab "Defaults" to "General";
* CHANGED: Added some instructions comments to translators;
* CHANGED: The default date interval for global and post type settings now only accepts EN format, $495;
* CHANGED: Add log message when date time offset is invalid when trying to schedule a future action;
* CHANGED: Change the date format on "Scheduled Date" column in the Future Actions list to use the site timezone and not GMT date. GMT date is now displayed on the tooltip;
* CHANGED: Changed text and buttons labels on Diagnostics and Tools settings tab, #506;
* CHANGED: Add method getExpirationDateAsUnixTime to the ExpirablePostModel class;
* CHANGED: Changed method getTitle on ExpirablePostModel to return title from args if post is not found anymore;
* CHANGED: Changed method getPostType on ExpirablePostModel to return post type from args if post is not found anymore;
* DEPRECATED: The methods getDefaultDate and getDefaultDateCustom on SettingsFacade class are deprecated;

= [3.0.4] - 04 Jul, 2023 =

* FIXED: Fix "Save changes" notification on block editor when post is not edited, #449;
* FIXED: Fix unchecked category on classic editor when editing a post with future action enabled, #481;
* FIXED: Update French translation, #473;
* FIXED: Fix the plugin initialization to properly load the plugin text domain, and CLI commands;
* FIXED: Fix the start of the week on the calendar, honoring the site setting, #484;
* FIXED: Fix the taxonomy field for custom post types;
* FIXED: Fix consistency in the message in the block editor, compared to classic editor, when no taxonomy is selected;
* FIXED: Update the .pot file;
* CHANGED: The name of the block editor component changed from `postexpirator-sidebar` to `publishpress-future-action`, #449;
* CHANGED: Update the Action Scheduler library from 3.6.0 to 3.6.1;
* REMOVED: Remove internal function `postexpirator_init`;

= [3.0.3] - 20 Jun, 2023 =

* FIXED: Error on the block editor: The "postexpirator-sidebar" plugin has encountered an error and cannot be rendered, #475;
* FIXED: Error message in the future action column: Action scheduled but its definition is not available anymore, #474;
* CHANGED: Update message when future action data is corrupted for the post;

= [3.0.2] - 19 Jun, 2023 =

* FIXED: Fix warning displayed in the classic editor if a taxonomy is not properly selected, #453;
* FIXED: Fix typo in a message when a taxonomy is not properly selected;
* FIXED: Fix a blank post type label in the Arguments column in the Actions Log list when a post type is not registered anymore;
* FIXED: FIx error message in the Future Action column if the action is not found anymore, #454;
* FIXED: Fix default date/time offset, #455;
* FIXED: Fix label "Action" on a few screens, #458;
* FIXED: Fix broken screen due by a long select field in Classic Editor, #458;
* FIXED: Fix Future action ordering not working on "Posts" screen, #462;
* FIXED: Update .pot file and some translation strings;

= [3.0.1] - 15 Jun, 2023 =

* ADDED: Add diagnostic check for DB schema in the Settings page;
* CHANGED: Changed privacy for method PublishPress\Future\Framework\WordPress\Models\PostModel::getPostInstance from `private` to `protected`;
* FIXED: Restore future action data on post meta fields, #452;
* FIXED: Fix PHP warning about undefined index 'categoryTaxonomy';
* FIXED: Fix auto-enabled future action on new posts, #447;
* FIXED: Fix default future action type on custom post types;
* FIXED: First letter of future actions log is not capitalized on some messages in the popup view;
* FIXED: Fix log message when actions related to taxonomy terms run;

= [3.0.0] - 13 Jun, 2023 =

* ADDED: Add Dutch translation files, #429;
* CHANGED: Namespace has been changed from `PublishPressFuture` to `PublishPress\Future`;
* CHANGED: Functions, autoload, class aliases and class loading have been moved into a hook for the action `plugins_loaded` with priority 10;
* CHANGED: Post expiration queue migrated from WP Cron to Action Scheduler library from WooCommerce, #149;
* CHANGED: Deprecate hook "publishpressfuture_expire" in favor of "publishpress_future/run_workflow". New hook has two arguments: postId and action, #149;
* CHANGED: Changed the label "Type" to "Action" in the bulk edit field;
* CHANGED: Change the capability checked before authorizing API usage. Changed from `edit_posts` to `publishpress_future_expire_post`;
* CHANGED: Added the old post status in the log message when the post expires changing status;
* CHANGED: Change the text of options in the bulk edit field, for more clearance;
* CHANGED: Change text of Post Types settings tab;
* CHANGED: FIXED: Replace "Expiry" with "Actions", #392;
* FIXED: Fix PHP warning about undefined index 'terms', #412;
* FIXED: Fix error on block editor: can't read "length" of undefined;
* FIXED: Fix escaping on a few admin text;
* FIXED: Fix text and positions of expiration fields in the bulk edit form;
* FIXED: Fix email notifications, #414;
* FIXED: Fix PHP Fatal error: Uncaught TypeError: gmdate(): Argument #2 ($timestamp) must be of type ?int, #413;
* FIXED: All the expirations scheduled to the future run if we call "wp cron events run --all", #340;
* FIXED: Deactivation of the plugin does not remove the cron jobs and settings, #107;
* FIXED: Can we make the cron schedule more human-readable, #231;
* FIXED: Expiration actions related to taxonomy are not working if default way to expire is not taxonomy related, #409;
* FIXED: Database error on a new site install, #424;
* FIXED: Bulk Edit Text doesn't match Quick Edit, #422;
* FIXED: Expiration Email Notification is not working, #414;
* FIXED: Capital case for statuses, #430;
* FIXED: Make sure all files has protection against direct access, #436;
* FIXED: Fix fatal error sending expiration email, #434, #433;

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
* FIXED: Combining Multiple Cron Events #149;


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
