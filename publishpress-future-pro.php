<?php

/**
 * Plugin Name: PublishPress Future Pro
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: PublishPress Future allows you to schedule automatic changes to posts, pages and other content types.
 * Author: PublishPress
 * Version: 3.0.4
 * Author URI: http://publishpress.com
 * Text Domain: publishpress-future-pro
 * Domain Path: /languages
 * Requires at least: 5.3
 * Requires PHP: 5.6
 */

namespace PublishPress\FuturePro {

    use Exception;
    use PublishPress\Future\Core\DI\Container;
    use PublishPress\FuturePro\Core\ServicesAbstract;

    defined('ABSPATH') or die('No direct script access allowed.');

    if (defined('PUBLISHPRESS_FUTURE_PRO_LOADED')) {
        return;
    }

    const PLUGIN_VERSION = '3.0.4';
    const EDD_ITEM_ID = '129032';
    const EDD_SITE_URL = 'https://publishpress.com';
    const BASE_PATH = __DIR__;
    const INCLUDES_DIR = BASE_PATH . '/src/includes';
    const VENDOR_DIR = BASE_PATH . '/vendor';
    const PLUGIN_SLUG = 'publishpress-future-pro';
    const PLUGIN_NAME = 'PublishPress Future Pro';
    const FREE_PLUGIN_NAME = 'PublishPress Future';
    const PLUGIN_AUTHOR = 'PublishPress';

    include_once INCLUDES_DIR . '/catch-exception.php';

    try {
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
        require_once __DIR__ . '/src/includes/free-plugin-launcher.php';

        add_action('plugins_loaded', function () {
            try {
                if (! class_exists('PublishPress\Future\Core\DI\Container')) {
                    throw new Exception(
                        'PublishPress Future Pro can\'t fully load because PublishPress Future library was not found.'
                    );
                }

                // Initialize the plugin.
                $services = require INCLUDES_DIR . '/services.php';
                $container = Container::getInstance();
                $container->registerServices($services);

                require_once __DIR__ . '/src/includes/install.php';
                require_once __DIR__ . '/src/includes/uninstall.php';
                require_once __DIR__ . '/src/includes/deprecated.php';

                register_activation_hook(__FILE__, 'PublishPress\\FuturePro\\install');
                register_deactivation_hook(__FILE__, 'PublishPress\\FuturePro\\uninstall');

                $container->get(ServicesAbstract::PLUGIN)->initialize();

                define('PUBLISHPRESS_FUTURE_PRO_LOADED', true);
            } catch (Exception $e) {
                logCatchException($e);
            }
        }, 12, 0);
    } catch (Exception $e) {
        logCatchException($e);
    }
}
