<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.8.0-alpha.1
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 */

use PublishPressFuture\Framework\Dependencies\Container;
use PublishPressFuture\Framework\Dependencies\ServicesAbstract;

if (! defined('PUBLISHPRESS_FUTURE_LOADED')) {
    define('PUBLISHPRESS_FUTURE_LOADED', true);

    try {
        $autoloadPath = __DIR__ . '/vendor/autoload.php';
        if (! class_exists('PublishPressFuture\\Core\\PluginFacade') && is_readable($autoloadPath)) {
            require_once $autoloadPath;
        }

        $services = require __DIR__ . '/services.php';
        $container = new Container($services);

        $pluginFile = __FILE__;

        require_once __DIR__ . '/legacy/defines.php';
        require_once __DIR__ . '/legacy/functions.php';
        require_once __DIR__ . '/legacy/autoload.php';

        // Launch the plugin
        $container->get(ServicesAbstract::PLUGIN_FACADE)->initialize();
    } catch (Exception $e) {
        error_log('[PUBLISHPRESSFUTURE] ' . $e->getMessage());
    }
}
