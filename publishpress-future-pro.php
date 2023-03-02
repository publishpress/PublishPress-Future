<?php

/*
 * Plugin Name: PublishPress Future Pro
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.9.2
 * Author URI: http://publishpress.com
 * Text Domain: publishpress-future-pro
 * Domain Path: /languages
 */

namespace PublishPressFuturePro {

    use Exception;
    use PublishPressFuture\Core\DI\Container;
    use PublishPressFuturePro\Core\ServicesAbstract;

    defined('ABSPATH') or die('No direct script access allowed.');

    if (defined('PUBLISHPRESS_FUTURE_PRO_LOADED')) {
        return;
    }

    const PLUGIN_VERSION = '2.9.2';
    const EDD_ITEM_ID = '129032';
    const EDD_SITE_URL = 'https://publishpress.com';
    const BASE_PATH = __DIR__;
    const INCLUDES_DIR = BASE_PATH . '/src/includes';
    const VENDOR_DIR = BASE_PATH . '/vendor';
    const PLUGIN_SLUG = 'publishpress-future-pro';
    const PLUGIN_NAME = 'PublishPress Future Pro';
    const FREE_PLUGIN_NAME = 'PublishPress Future';
    const PLUGIN_AUTHOR = 'PublishPress';

    try {
        // If the PHP version is not compatible, terminate the plugin execution.
        if (! include_once INCLUDES_DIR . '/check-php-version.php') {
            return;
        }

        // Active the plugin instance protection.
        include_once INCLUDES_DIR . '/plugin-instance-protection.php';

        // If Free plugin is already loaded, terminate the plugin execution.
        if (defined('PUBLISHPRESS_FUTURE_LOADED')) {
            return;
        }

        // Start the autoloader.
        $autoloadPath = VENDOR_DIR . '/autoload.php';
        if (file_exists($autoloadPath)) {
            require_once $autoloadPath;
        }

        // Start the free plugin.
        define('PUBLISHPRESS_FUTURE_LOADED_BY_PRO', true);
        define('PUBLISHPRESS_FUTURE_SKIP_VERSION_NOTICES', true);
        require_once __DIR__ . '/src/includes/free-plugin-initializator.php';

        // Initialize the plugin.
        $services = require INCLUDES_DIR . '/services.php';
        $container = Container::getInstance();
        $container->registerServices($services);

        require_once __DIR__ . '/src/includes/install.php';
        require_once __DIR__ . '/src/includes/uninstall.php';

        register_activation_hook(__FILE__, 'PublishPressFuturePro\\install');
        register_deactivation_hook(__FILE__, 'PublishPressFuturePro\\uninstall');

        $container->get(ServicesAbstract::PLUGIN)->initialize();

        define('PUBLISHPRESS_FUTURE_PRO_LOADED', true);
    } catch (Exception $e) {
        include_once INCLUDES_DIR . '/catch-exception.php';
        logCatchedException($e);
    }
}
