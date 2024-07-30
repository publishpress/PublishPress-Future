<?php
/*
 * EndToEnd suite bootstrap file.
 *
 * This file is loaded AFTER the suite modules are initialized and WordPress has been loaded by the WPLoader module.
 *
 * The initial state of the WordPress site is the one set up by the dump file(s) loaded by the WPDb module, look for the
 * "modules.config.WPDb.dump" setting in the suite configuration file. The database will be dropped after each test
 * and re-created from the dump file(s).
 *
 * You can modify and create new dump files using WP-CLI or by operating directly on the WordPress site and database,
 * use the `vendor/bin/codecept dev:info` command to know the URL to the WordPress site.
 * Note that WP-CLI will not natively handle SQLite databases, so you will need to use the `wp:db:import` and
 * `wp:db:export` commands to import and export the database.
 * E.g.:
 * `vendor/bin/codecept wp:db:import tests/_wordpress tests/Support/Data/dump.sql` to load dump file.
 * `wp --path=tests/_wordpress plugin activate woocommerce` to activate the WooCommerce plugin.
 * `wp --path=tests/_wordpress user create alice alice@example.com --role=administrator` to create a new user.
 * `vendor/bin/codecept wp:db:export tests/_wordpress tests/Support/Data/dump.sql` to update the dump file.
 */

define('ABSPATH', __DIR__);


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
