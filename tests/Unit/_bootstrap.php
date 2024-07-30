<?php

define('ABSPATH', '/tmp');

use PublishPress\Future\Core\Autoloader;

require_once __DIR__ . '/../../lib/vendor/publishpress/psr-container/lib/autoload.php';
require_once __DIR__ . '/../../lib/vendor/publishpress/pimple-pimple/lib/autoload.php';


require_once __DIR__ . '/../../lib/vendor/woocommerce/action-scheduler/action-scheduler.php';

if (! class_exists('PublishPress\Future\Core\Autoloader')) {
    require_once __DIR__ . '/../../src/Core/Autoloader.php';
}
Autoloader::register();

if (! defined('PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH')) {
    define('PUBLISHPRESS_FUTURE_LIB_VENDOR_PATH', realpath(__DIR__ . '/../../lib/vendor'));
}
