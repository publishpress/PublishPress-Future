<?php

use PublishPressFuture\Core\ServicesAbstract;

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_VERSION', $container->get(ServicesAbstract::PLUGIN_VERSION));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DATEFORMAT', $container->get(ServicesAbstract::DEFAULT_DATE_FORMAT));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_TIMEFORMAT', $container->get(ServicesAbstract::DEFAULT_TIME_FORMAT));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERCONTENTS', $container->get(ServicesAbstract::DEFAULT_FOOTER_CONTENT));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERSTYLE', $container->get(ServicesAbstract::DEFAULT_FOOTER_STYLE));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERDISPLAY', $container->get(ServicesAbstract::DEFAULT_FOOTER_DISPLAY));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATION', $container->get(ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', $container->get(ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DEBUGDEFAULT', $container->get(ServicesAbstract::DEFAULT_DEBUG));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EXPIREDEFAULT', $container->get(ServicesAbstract::DEFAULT_EXPIRATION_DATE));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_SLUG', $container->get(ServicesAbstract::PLUGIN_SLUG));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASEDIR', $container->get(ServicesAbstract::BASE_PATH));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASENAME', basename($pluginFile));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASEURL', $container->get(ServicesAbstract::BASE_URL));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_LEGACYDIR', POSTEXPIRATOR_BASEDIR . '/legacy');
