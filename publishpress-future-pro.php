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

// Default Values
use PublishPressFuturePro\LegacyPluginManager;

defined('ABSPATH') or die('No direct script access allowed.');

if (! defined('PUBLISHPRESS_FUTURE_PRO_VERSION')) {
    define('PUBLISHPRESS_FUTURE_PRO_VERSION', '2.8.0-alpha.1');
    define('PUBLISHPRESS_FUTURE_PRO_BASEDIR', dirname(__FILE__));
    define('PUBLISHPRESS_FUTURE_PRO_BASENAME', basename(__FILE__));
    define('PUBLISHPRESS_FUTURE_PRO_BASEURL', plugins_url('/', __FILE__));

    $autoloadPath = PUBLISHPRESS_FUTURE_PRO_BASEDIR . '/vendor/autoload.php';
    if (file_exists($autoloadPath)) {
        require_once $autoloadPath;
    }

    if (LegacyPluginManager::shouldAskToDisableLegacyPlugin()) {
        add_action(
            'admin_notices',
            function () {
                $msg = sprintf(
                    '<strong>%s:</strong> %s',
                    __('Warning', 'publishpress-future-pro'),
                    __(
                        'Please, deactivate and remove PublishPress Future before using PublishPress Future Pro.',
                        'publishpress-future-pro'
                    )
                );

                echo "<div class='notice notice-error is-dismissible' style='color:black'><p>" . $msg . '</p></div>';
            },
            5
        );
    }

    if (! LegacyPluginManager::isLegacyPluginActivated()) {
        $legacyPluginPath = PUBLISHPRESS_FUTURE_PRO_BASEDIR . '/vendor/publishpress/post-expirator/post-expirator.php';
        if (file_exists($legacyPluginPath)) {
            require_once $legacyPluginPath;
        }
    }
}
