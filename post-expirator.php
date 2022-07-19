<?php
/**
 * Plugin Name: PublishPress Future
 * Plugin URI: http://wordpress.org/extend/plugins/post-expirator/
 * Description: Allows you to add an expiration date (minute) to posts which you can configure to either delete the post, change it to a draft, or update the post categories at expiration time.
 * Author: PublishPress
 * Version: 2.8.0-alpha.1
 * Author URI: http://publishpress.com
 * Text Domain: post-expirator
 * Domain Path: /languages
 */

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\HooksAbstract;
use PublishPressFuture\Core\ServicesAbstract;

if (! defined('POSTEXPIRATOR_LOADED')) {
    define('POSTEXPIRATOR_LOADED', true);

    $autoloadPath = __DIR__ . '/vendor/autoload.php';
    if (! class_exists('PublishPressFuture\\Core\\Plugin') && is_readable($autoloadPath)) {
        require_once $autoloadPath;
    }

    $services = require __DIR__ . '/services.php';
    $container = new Container($services);

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_VERSION', $container->get(ServicesAbstract::SERVICE_PLUGIN_VERSION));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_DATEFORMAT', $container->get(ServicesAbstract::SERVICE_DEFAULT_DATE_FORMAT));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_TIMEFORMAT', $container->get(ServicesAbstract::SERVICE_DEFAULT_TIME_FORMAT));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_FOOTERCONTENTS', $container->get(ServicesAbstract::SERVICE_DEFAULT_FOOTER_CONTENT));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_FOOTERSTYLE', $container->get(ServicesAbstract::SERVICE_DEFAULT_FOOTER_STYLE));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_FOOTERDISPLAY', $container->get(ServicesAbstract::SERVICE_DEFAULT_FOOTER_DISPLAY));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_EMAILNOTIFICATION', $container->get(ServicesAbstract::SERVICE_DEFAULT_EMAIL_NOTIFICATION));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', $container->get(ServicesAbstract::SERVICE_DEFAULT_EMAIL_NOTIFICATION_ADMINS));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_DEBUGDEFAULT', $container->get(ServicesAbstract::SERVICE_DEFAULT_DEBUG));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_EXPIREDEFAULT', $container->get(ServicesAbstract::SERVICE_DEFAULT_EXPIRATION_DATE));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_SLUG', $container->get(ServicesAbstract::SERVICE_PLUGIN_SLUG));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_BASEDIR', $container->get(ServicesAbstract::SERVICE_BASE_PATH));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_BASENAME', basename(__FILE__));

    /**
     * @deprecated 2.8.0
     */
    define('POSTEXPIRATOR_BASEURL', $container->get(ServicesAbstract::SERVICE_BASE_URL));

    require_once __DIR__ . '/legacy-functions.php';

    require_once __DIR__ . '/autoload.php';

    $actionsFacade = $container->get(ServicesAbstract::SERVICE_ACTIONS_FACADE);

    // Launch the plugin
    $actionsFacade->execute(HooksAbstract::ACTION_PLUGIN_INIT);

    $pluginFacade = $container->get(ServicesAbstract::SERVICE_PLUGIN_FACADE);
}
