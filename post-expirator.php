<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: PublishPress Future allows you to schedule automatic changes to posts, pages and other content types.
 * Author: PublishPress
 * Version: 3.0.6
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 * Requires at least: 5.3
 * Requires PHP: 5.6
 */

use PublishPress\Future\Core\Autoloader;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

use function PublishPress\Future\logCatchException;

defined('ABSPATH') or die('Direct access not allowed.');

if (! defined('PUBLISHPRESS_FUTURE_LOADED')) {
    include __DIR__ . '/src/catch-exception.php';

    try {
        define('PUBLISHPRESS_FUTURE_LOADED', true);

        if (! defined('PUBLISHPRESS_FUTURE_VERSION')) {
            define('PUBLISHPRESS_FUTURE_VERSION', '3.0.6');
        }

        $vendorAutoloadPath = __DIR__ . '/vendor/autoload.php';
        if (is_readable($vendorAutoloadPath)) {
            require_once $vendorAutoloadPath;
        }

        require_once PUBLISHPRESS_FUTURE_VENDOR_PATH . '/woocommerce/action-scheduler/action-scheduler.php';

        add_action('plugins_loaded', function () {
            try {
                if (! class_exists('PublishPress\Future\Core\Autoloader')) {
                    require_once __DIR__ . '/src/Core/Autoloader.php';
                }
                Autoloader::register();

                $pluginFile = __FILE__;

                $services = require __DIR__ . '/services.php';
                $container = new Container($services);

                require_once __DIR__ . '/legacy/defines.php';
                require_once __DIR__ . '/legacy/deprecated.php';
                require_once __DIR__ . '/legacy/functions.php';
                require_once __DIR__ . '/legacy/autoload.php';

                $container->get(ServicesAbstract::PLUGIN)->initialize();
            } catch (Exception $e) {
                logCatchException($e);
            }
        }, 10, 0);

    } catch (Exception $e) {
        logCatchException($e);
    }
}
