<?php

use PublishPressFuture\Core\AbstractServices;

$defaultData = $container->get(AbstractServices::DEFAULT_DATA);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_VERSION', $container->get(AbstractServices::PLUGIN_VERSION));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DATEFORMAT', $defaultData[AbstractServices::DEFAULT_DATE_FORMAT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_TIMEFORMAT', $defaultData[AbstractServices::DEFAULT_TIME_FORMAT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERCONTENTS', $defaultData[AbstractServices::DEFAULT_FOOTER_CONTENT]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERSTYLE', $defaultData[AbstractServices::DEFAULT_FOOTER_STYLE]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_FOOTERDISPLAY', $defaultData[AbstractServices::DEFAULT_FOOTER_DISPLAY]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATION', $defaultData[AbstractServices::DEFAULT_EMAIL_NOTIFICATION]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EMAILNOTIFICATIONADMINS', $defaultData[AbstractServices::DEFAULT_EMAIL_NOTIFICATION_ADMINS]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_DEBUGDEFAULT', $defaultData[AbstractServices::DEFAULT_DEBUG]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_EXPIREDEFAULT', $defaultData[AbstractServices::DEFAULT_EXPIRATION_DATE]);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_SLUG', $container->get(AbstractServices::PLUGIN_SLUG));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASEDIR', $container->get(AbstractServices::BASE_PATH));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASENAME', basename($pluginFile));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_BASEURL', $container->get(AbstractServices::BASE_URL));

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_LOADED', true);

/**
 * @deprecated 2.8.0
 */
define('POSTEXPIRATOR_LEGACYDIR', POSTEXPIRATOR_BASEDIR . '/legacy');
