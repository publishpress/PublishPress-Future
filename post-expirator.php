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

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\ServicesAbstract;

if (! defined('PUBLISHPRESS_FUTURE_LOADED')) {
    define('PUBLISHPRESS_FUTURE_LOADED', true);

    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    if (! class_exists('PublishPressFuture\\Core\\Plugin') && is_readable($autoloadPath)) {
        require_once $autoloadPath;
    }

    $services = require __DIR__ . '/services.php';
    $container = new Container($services);

    $pluginFile = __FILE__;

    $legacyPath = $container->get(ServicesAbstract::LEGACY_PATH);
    require_once $legacyPath . '/defines.php';
    require_once $legacyPath . '/functions.php';
    require_once $legacyPath . '/autoload.php';

    // Launch the plugin
    $hooks = $container->get(ServicesAbstract::HOOKS_FACADE);
    $plugin = $container->get(ServicesAbstract::PLUGIN_FACADE);

    $hooks->addAction(HooksAbstract::ACTION_PLUGIN_INIT, function() use ($plugin) {
        $plugin->initialize();
    });

    $hooks->doAction(HooksAbstract::ACTION_PLUGIN_INIT);
}
