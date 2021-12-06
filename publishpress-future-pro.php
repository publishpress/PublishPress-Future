<?php
/*
Plugin Name: PublishPress Future Pro
Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
Author: PublishPress
Version: 2.7.0
Author URI: http://publishpress.com
Text Domain: post-expirator
Domain Path: /languages
*/

// Default Values
define('PUBLISHPRESS_FUTURE_PRO_VERSION', '2.7.0');
define('PUBLISHPRESS_FUTURE_PRO_BASEDIR', dirname(__FILE__));
define('PUBLISHPRESS_FUTURE_PRO_BASENAME', basename(__FILE__));
define('PUBLISHPRESS_FUTURE_PRO_BASEURL', plugins_url('/', __FILE__));

require_once PUBLISHPRESS_FUTURE_PRO_BASEDIR . '/vendor/autoload.php';

