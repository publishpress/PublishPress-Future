<?php

use PublishPressFuture\Core\Container;
use PublishPressFuture\Core\ServicesAbstract;

$container = Container::getInstance();

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
define('POSTEXPIRATOR_BASENAME', basename($pluginFile));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASEURL', $container->get(ServicesAbstract::SERVICE_BASE_URL));
