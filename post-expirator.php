<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.9.2
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 */

use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Core\DI\Container;

if (! defined('PUBLISHPRESS_FUTURE_LOADED')) {
    define('PUBLISHPRESS_FUTURE_LOADED', true);

    try {
        $autoloadPath = __DIR__ . '/vendor/autoload.php';
        if (! class_exists('PublishPressFuture\\Core\\Plugin') && is_readable($autoloadPath)) {
            require_once $autoloadPath;
        }

        $pluginFile = __FILE__;

        $services = require __DIR__ . '/services.php';

        $container = new Container($services);

        require_once __DIR__ . '/legacy/defines.php';
        require_once __DIR__ . '/legacy/functions.php';
        require_once __DIR__ . '/legacy/deprecated-functions.php';
        require_once __DIR__ . '/legacy/autoload.php';

        $container->get(ServicesAbstract::PLUGIN)->initialize();
    } catch (Exception $e) {
        $trace = $e->getTrace();

        $traceText = '';

        foreach ($trace as $item) {
            $traceText .= $item['file'] . ':' . $item['line'] . ' ' . $item['function'] . '(), ';
        }

        $message = sprintf(
            "PUBLISHPRESS FUTURE Exception: %s: %s. Backtrace: %s",
            get_class($e),
            $e->getMessage(),
            $traceText
        );

        // Make the log message binary safe removing any non-printable chars.
        $message = addcslashes($message, "\000..\037\177..\377\\");

        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
        error_log($message);
    }
}
