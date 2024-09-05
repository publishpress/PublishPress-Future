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

 define('ABSPATH', __DIR__ . '/../../dev-workspace/.cache/wordpress/');

class Autoloader
{
    public function autoload($class)
    {
        $prefixes = [
            'PublishPress\\FuturePro\\' => __DIR__ . '/../../src/classes/',
            'PublishPress\\Future\\' => __DIR__ . '/../../lib/vendor/publishpress/publishpress-future/src/'
        ];

        foreach ($prefixes as $prefix => $base_dir) {
            $len = strlen($prefix);
            if (strncmp($prefix, $class, $len) !== 0) {
                continue;
            }

            $relative_class = substr($class, $len);
            $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

            if (file_exists($file)) {
                require $file;
            }
        }
    }
}

spl_autoload_register([new Autoloader(), 'autoload']);

// Make sure the environment variables are set (getenv inside wp-config.php is not enough, it seems)
putenv('WORDPRESS_DB_NAME=' . $_ENV['WORDPRESS_DB_NAME']);
putenv('WORDPRESS_DB_USER=' . $_ENV['WORDPRESS_DB_USER']);
putenv('WORDPRESS_DB_PASSWORD=' . $_ENV['WORDPRESS_DB_PASSWORD']);
putenv('WORDPRESS_DB_HOST=' . $_ENV['WORDPRESS_DB_HOST']);
