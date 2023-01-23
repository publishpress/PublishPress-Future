<?php
/*
Plugin Name: PublishPress Future Pro
Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
Author: PublishPress
Version: 2.8.0-alpha.1
Author URI: http://publishpress.com
Text Domain: post-expirator
Domain Path: /languages
*/

// Default Values
use PublishPressFuturePro\LegacyPluginManager;

defined('ABSPATH') or die('No direct script access allowed.');

$includeFileRelativePath = '/publishpress/publishpress-instance-protection/include.php';
if (file_exists(__DIR__ . '/vendor' . $includeFileRelativePath)) {
    require_once __DIR__ . '/vendor' . $includeFileRelativePath;
}

if (class_exists('PublishPressInstanceProtection\\Config')) {
    $pluginCheckerConfig = new PublishPressInstanceProtection\Config();
    $pluginCheckerConfig->pluginSlug     = 'publishpress-future-pro';
    $pluginCheckerConfig->pluginName     = 'PublishPress Future Pro';
    $pluginCheckerConfig->freePluginName = 'PublishPress Future';
    $pluginCheckerConfig->isProPlugin    = true;

    $pluginChecker = new PublishPressInstanceProtection\InstanceChecker($pluginCheckerConfig);
}

if (! defined('PUBLISHPRESS_FUTURE_PRO_LOADED')) {
    define('PUBLISHPRESS_FUTURE_PRO_VERSION', '2.9.0-alpha.1');
    define('PUBLISHPRESS_FUTURE_PRO_BASEDIR', dirname(__FILE__));
    define('PUBLISHPRESS_FUTURE_PRO_BASENAME', basename(__FILE__));
    define('PUBLISHPRESS_FUTURE_PRO_BASEURL', plugins_url('/', __FILE__));
    define('PUBLISHPRESS_FUTURE_PRO_LOADED', true);

    $autoloadPath = PUBLISHPRESS_FUTURE_PRO_BASEDIR . '/vendor/autoload.php';
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
    }
}
