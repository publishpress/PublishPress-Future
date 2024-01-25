<?php

/**
 * Plugin Name: PublishPress Future Pro
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: PublishPress Future allows you to schedule automatic changes to posts, pages and other content types.
 * Author: PublishPress
 * Version: 3.2.0
 * Author URI: http://publishpress.com
 * Text Domain: publishpress-future-pro
 * Domain Path: /languages
 * Requires at least: 6.1
 * Requires PHP: 7.2.5
 */

namespace PublishPress\FuturePro;

use Exception;
use PublishPress\Future\Core\DI\Container;
use PublishPress\FuturePro\Core\ServicesAbstract;

defined('ABSPATH') or die('No direct script access allowed.');

if (defined('PUBLISHPRESS_FUTURE_PRO_LOADED')) {
    return;
}

global $wp_version;

$min_php_version = '7.2.5';
$min_wp_version  = '6.1';

// If the PHP or WP version is not compatible, terminate the plugin execution.
$invalid_php_version = version_compare(phpversion(), $min_php_version, '<');
$invalid_wp_version = version_compare($wp_version, $min_wp_version, '<');

if ($invalid_php_version || $invalid_wp_version) {
    return;
}

define('PUBLISHPRESS_FUTURE_PRO_PLUGIN_VERSION', '3.2.0');
define('PUBLISHPRESS_FUTURE_PRO_EDD_ITEM_ID', '129032');
define('PUBLISHPRESS_FUTURE_PRO_EDD_SITE_URL', 'https://publishpress.com');
define('PUBLISHPRESS_FUTURE_PRO_BASE_PATH', __DIR__);
define('PUBLISHPRESS_FUTURE_PRO_INCLUDES_DIR', PUBLISHPRESS_FUTURE_PRO_BASE_PATH . '/src/includes');
define('PUBLISHPRESS_FUTURE_PRO_VENDOR_DIR', PUBLISHPRESS_FUTURE_PRO_BASE_PATH . '/lib/vendor');
define('PUBLISHPRESS_FUTURE_PRO_PLUGIN_SLUG', 'publishpress-future-pro');
define('PUBLISHPRESS_FUTURE_PRO_PLUGIN_NAME', 'PublishPress Future Pro');
define('PUBLISHPRESS_FUTURE_PRO_FREE_PLUGIN_NAME', 'PublishPress Future');
define('PUBLISHPRESS_FUTURE_PRO_PLUGIN_AUTHOR', 'PublishPress');

include_once PUBLISHPRESS_FUTURE_PRO_INCLUDES_DIR . '/catch-exception.php';

try {
    // Active the plugin instance protection.
    include_once PUBLISHPRESS_FUTURE_PRO_INCLUDES_DIR . '/plugin-instance-protection.php';

    // If Free plugin is already loaded, terminate the plugin execution.
    if (defined('PUBLISHPRESS_FUTURE_LOADED')) {
        return;
    }

    // Start the autoloader.
    $autoloadFilePath = PUBLISHPRESS_FUTURE_PRO_VENDOR_DIR . '/autoload.php';
    if (
        ! class_exists('ComposerAutoloaderInitPublishPressFuturePro')
        && is_file($autoloadFilePath)
        && is_readable($autoloadFilePath)
    ) {
        require_once $autoloadFilePath;
    }

    // Start the free plugin.
    define('PUBLISHPRESS_FUTURE_LOADED_BY_PRO', true);
    define('PUBLISHPRESS_FUTURE_SKIP_VERSION_NOTICES', true);

    require_once __DIR__ . '/src/includes/free-plugin-launcher.php';

    add_action('init', function () {
        try {
            if (! class_exists('PublishPress\Future\Core\DI\Container')) {
                throw new Exception(
                    'PublishPress Future Pro can\'t fully load because PublishPress Future library was not found.'
                );
            }

            // Initialize the plugin.
            $services = require PUBLISHPRESS_FUTURE_PRO_INCLUDES_DIR . '/services.php';
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
