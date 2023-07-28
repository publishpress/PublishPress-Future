<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: PublishPress Future allows you to schedule automatic changes to posts, pages and other content types.
 * Author: PublishPress
 * Version: 3.1.0-alpha.1
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 * Requires at least: 5.5
 * Requires PHP: 7.2.5
 */

use PublishPress\Future\Core\Autoloader;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

use function PublishPress\Future\logCatchException;

defined('ABSPATH') or die('Direct access not allowed.');

global $wp_version;

$min_php_version = '7.2.5';
$min_wp_version  = '5.5';

// If the PHP or WP version is not compatible, terminate the plugin execution.
$invalid_php_version = version_compare(phpversion(), $min_php_version, '<');
$invalid_wp_version = version_compare($wp_version, $min_wp_version, '<');

if ($invalid_php_version || $invalid_wp_version) {
    return;
}

if (! defined('PUBLISHPRESS_FUTURE_LOADED')) {
    include __DIR__ . '/src/catch-exception.php';

    try {
        define('PUBLISHPRESS_FUTURE_LOADED', true);
        /**
         * @deprecated
         */
        define('PUBLISHPRESS_FUTURE_BASE_PATH', __DIR__);

        if (! defined('PUBLISHPRESS_FUTURE_VERSION')) {
            define('PUBLISHPRESS_FUTURE_VERSION', '3.1.0-alpha.1');
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
