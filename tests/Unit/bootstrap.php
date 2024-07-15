<?php

define('ABSPATH', '/tmp');

use PublishPress\Future\Core\Autoloader;

$autoloadFilePath = __DIR__ . '/../../../lib/vendor/autoload.php';
if (! class_exists('ComposerAutoloaderInitPublishPressFuture')
    && is_file($autoloadFilePath)
    && is_readable($autoloadFilePath)
) {
    require_once $autoloadFilePath;
}

require_once __DIR__ . '/../../../lib/vendor/woocommerce/action-scheduler/action-scheduler.php';

if (! class_exists('PublishPress\Future\Core\Autoloader')) {
    require_once __DIR__ . '/../../../src/Core/Autoloader.php';
}
Autoloader::register();
