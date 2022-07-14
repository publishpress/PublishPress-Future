<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.7.7
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 */

$includeFilebRelativePath = '/publishpress/publishpress-instance-protection/include.php';
if (file_exists(__DIR__ . '/vendor' . $includeFilebRelativePath)) {
    require_once __DIR__ . '/vendor' . $includeFilebRelativePath;
} else if (defined('POSTEXPIRATOR_VENDOR_PATH') && file_exists(POSTEXPIRATOR_VENDOR_PATH . $includeFilebRelativePath)) {
    require_once POSTEXPIRATOR_VENDOR_PATH . $includeFilebRelativePath;
}

if (class_exists('PublishPressInstanceProtection\\Config')) {
    $pluginCheckerConfig = new PublishPressInstanceProtection\Config();
    $pluginCheckerConfig->pluginSlug = 'post-expirator';
    $pluginCheckerConfig->pluginName = 'PublishPress Future';

    $pluginChecker = new PublishPressInstanceProtection\InstanceChecker($pluginCheckerConfig);
}

if (! defined('POSTEXPIRATOR_LOADED')) {
    // Default Values
    define('POSTEXPIRATOR_VERSION', '2.7.7');
    define('POSTEXPIRATOR_DATEFORMAT', __('l F jS, Y', 'post-expirator'));
    define('POSTEXPIRATOR_TIMEFORMAT', __('g:ia', 'post-expirator'));
    define('POSTEXPIRATOR_FOOTERCONTENTS', __('Post expires at EXPIRATIONTIME on EXPIRATIONDATE', 'post-expirator'));
    define('POSTEXPIRATOR_FOOTERSTYLE', 'font-style: italic;');
    define('POSTEXPIRATOR_FOOTERDISPLAY', '0');
    define('POSTEXPIRATOR_EMAILNOTIFICATION', '0');
    define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', '0');
    define('POSTEXPIRATOR_DEBUGDEFAULT', '0');
    define('POSTEXPIRATOR_EXPIREDEFAULT', 'null');
    define('POSTEXPIRATOR_SLUG', 'post-expirator');
    define('POSTEXPIRATOR_BASEDIR', dirname(__FILE__));
    define('POSTEXPIRATOR_BASENAME', basename(__FILE__));
    define('POSTEXPIRATOR_BASEURL', plugins_url('/', __FILE__));
    define('POSTEXPIRATOR_LOADED', true);

    require_once POSTEXPIRATOR_BASEDIR . '/functions.php';

    $autoloadPath = POSTEXPIRATOR_BASEDIR . '/vendor/autoload.php';
    if (false === class_exists('PublishPressFuture\\DummyForAutoloadDetection')
        && true === file_exists($autoloadPath)
    ) {
        include_once $autoloadPath;
    }

    require_once POSTEXPIRATOR_BASEDIR . '/autoload.php';

    /**
     * Launch the plugin by initializing its helpers.
     */
    function postexpirator_launch()
    {
        PostExpirator_Facade::getInstance();
    }

    postexpirator_launch();
}
