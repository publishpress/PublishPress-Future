=== PublishPress Future Pro: Automatically Unpublish WordPress Posts ===
Contributors: publishpress, kevinB, stevejburge, andergmartins, rozroz
Author: publishpress
Author URI: https://publishpress.com
Tags: expire, posts, pages, schedule
Requires at least: 5.3
Requires PHP: 5.6
Tested up to: 6.2
Stable tag: 3.0.3

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
