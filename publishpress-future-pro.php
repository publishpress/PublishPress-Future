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

use PublishPressFuture\Core\DI\Container;
use PublishPressFuturePro\Core\ServicesAbstract;

defined('ABSPATH') or die('No direct script access allowed.');

$includeFileRelativePath = '/publishpress/publishpress-instance-protection/include.php';
if (file_exists(__DIR__ . '/vendor' . $includeFileRelativePath)) {
    require_once __DIR__ . '/vendor' . $includeFileRelativePath;
}

if (class_exists('PublishPressInstanceProtection\\Config')) {
    $pluginCheckerConfig = new PublishPressInstanceProtection\Config();
    $pluginCheckerConfig->pluginSlug = 'publishpress-future-pro';
    $pluginCheckerConfig->pluginName = 'PublishPress Future Pro';
    $pluginCheckerConfig->freePluginName = 'PublishPress Future';
    $pluginCheckerConfig->isProPlugin = true;

    $pluginChecker = new PublishPressInstanceProtection\InstanceChecker($pluginCheckerConfig);
}

if (! defined('PUBLISHPRESS_FUTURE_PRO_LOADED')) {
    define('PUBLISHPRESS_FUTURE_PRO_LOADED', true);

    try {
        $autoloadPath = __DIR__ . '/vendor/autoload.php';
        if (file_exists($autoloadPath)) {
            require_once $autoloadPath;
        }

        $services = require __DIR__ . '/services.php';
        $container = new Container($services);

        $container->get(ServicesAbstract::PLUGIN)->initialize();
    } catch (Exception $e) {
        $trace = $e->getTrace();

        $traceText = '';

        foreach ($trace as $item) {
            $traceText .= $item['file'] . ':' . $item['line'] . ' ' . $item['function'] . '(), ';
        }

        $message = sprintf(
            "PUBLISHPRESS FUTURE PRO Exception: %s: %s. Backtrace: %s",
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
