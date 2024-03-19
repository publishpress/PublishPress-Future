<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: PublishPress Future allows you to schedule automatic changes to posts, pages and other content types.
 * Author: PublishPress
 * Version: 3.3.1
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 * Requires at least: 6.1
 * Requires PHP: 7.2.5
 */

namespace PublishPress\Future;

use Exception;
use PublishPress\Future\Core\Autoloader;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\Plugin;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;

defined('ABSPATH') or die('Direct access not allowed.');

global $wp_version;

$min_php_version = '7.2.5';
$min_wp_version  = '6.1';

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

        if (! defined('PUBLISHPRESS_FUTURE_BASE_PATH')) {
            /**
             * @deprecated Since 3.1.0. Use the value from service ServicesAbstract::BASE_PATH instead.
             */
            define('PUBLISHPRESS_FUTURE_BASE_PATH', __DIR__);
        }

        if (! defined('PUBLISHPRESS_FUTURE_VERSION')) {
            define('PUBLISHPRESS_FUTURE_VERSION', '3.3.1');
        }

        if (! defined('PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH')) {
            $vendorPath = __DIR__ . '/lib/vendor';
            if (defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO') && PUBLISHPRESS_FUTURE_LOADED_BY_PRO) {
                $vendorPath = \PUBLISHPRESS_FUTURE_PRO_VENDOR_DIR;
            }

            define('PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH', $vendorPath);
        }

        if (! defined('PUBLISHPRESS_FUTURE_VENDOR_PATH')) {
            /**d
             * @deprecated Since 3.1.0. Use PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH instead.
             */
            define('PUBLISHPRESS_FUTURE_VENDOR_PATH', PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH);
        }

        $autoloadFilePath = PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH . '/autoload.php';
        if (! class_exists('ComposerAutoloaderInitPublishPressFuture')
            && is_file($autoloadFilePath)
            && is_readable($autoloadFilePath)
        ) {
            require_once $autoloadFilePath;
        }

        require_once PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH . '/woocommerce/action-scheduler/action-scheduler.php';

        if (! class_exists('PublishPress\Future\Core\Autoloader')) {
            require_once __DIR__ . '/src/Core/Autoloader.php';
        }
        Autoloader::register();

        function loadDependencies()
        {
            if (defined('PUBLISHPRESS_FUTURE_LOADED_DEPENDENCIES')) {
                return;
            }

            $pluginFile = __FILE__;

            $services = require __DIR__ . '/services.php';
            $container = new Container($services);

            require_once __DIR__ . '/legacy/defines.php';
            require_once __DIR__ . '/legacy/deprecated.php';
            require_once __DIR__ . '/legacy/functions.php';
            require_once __DIR__ . '/legacy/autoload.php';

            define('PUBLISHPRESS_FUTURE_LOADED_DEPENDENCIES', true);
        }

        HooksFacade::registerActivationHook(
            __FILE__,
            function () {
                Plugin::onActivate();
            }
        );

        HooksFacade::registerDeactivationHook(
            __FILE__,
            function () {
                    loadDependencies();
                    Plugin::onDeactivate();
            }
        );

        add_action('init', function () {
            try {
                loadDependencies();

                $container = Container::getInstance();
                $container->get(ServicesAbstract::PLUGIN)->initialize();
            } catch (Exception $e) {
                logCatchException($e);
            }
        }, 10, 0);
    } catch (Exception $e) {
        logCatchException($e);
    }
}
