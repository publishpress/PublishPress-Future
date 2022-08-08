<?php

use PublishPressFuture\Core\DI\ServicesAbstract;

$defaultData = $container->get(ServicesAbstract::DEFAULT_DATA);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_VERSION', $container->get(ServicesAbstract::PLUGIN_VERSION));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DATEFORMAT', $defaultData[ServicesAbstract::DEFAULT_DATE_FORMAT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_TIMEFORMAT', $defaultData[ServicesAbstract::DEFAULT_TIME_FORMAT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERCONTENTS', $defaultData[ServicesAbstract::DEFAULT_FOOTER_CONTENT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERSTYLE', $defaultData[ServicesAbstract::DEFAULT_FOOTER_STYLE]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERDISPLAY', $defaultData[ServicesAbstract::DEFAULT_FOOTER_DISPLAY]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATION', $defaultData[ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', $defaultData[ServicesAbstract::DEFAULT_EMAIL_NOTIFICATION_ADMINS]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DEBUGDEFAULT', $defaultData[ServicesAbstract::DEFAULT_DEBUG]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EXPIREDEFAULT', $defaultData[ServicesAbstract::DEFAULT_EXPIRATION_DATE]);

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
define('POSTEXPIRATOR_LOADED', true);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_LEGACYDIR', POSTEXPIRATOR_BASEDIR . '/legacy');
