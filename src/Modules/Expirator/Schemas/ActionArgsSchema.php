<?php

namespace PublishPress\Future\Modules\Expirator\Schemas;

use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class ActionArgsSchema
{
    const HEALTH_ERROR_TABLE_DOES_NOT_EXIST = 1;
    const HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED = 2;

    public static $schemaErrors = [];

    /**
     * @return string
     */
    public static function getTableName()
    {
        global $wpdb;
        return $wpdb->prefix . 'ppfuture_actions_args';
    }

    /**
     * @deprecated 3.1.4 Use healthCheckTableExists() instead.
     */
    public static function tableExists()
    {
        return self::healthCheckTableExists();
    }

    public static function healthCheckTableExists()
    {
        $tableName = self::getTableName();

        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $table = $wpdb->get_var("SHOW TABLES LIKE '$tableName'");

        return $table === $tableName;
    }

    public static function healthCheckColumnArgsLengthIsUpdated()
    {
        global $wpdb;

        $tableName = self::getTableName();
        $dbName = DB_NAME;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $columnLength = (int)$wpdb->get_var("SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.`COLUMNS` WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = '$tableName' AND COLUMN_NAME = 'args'");

        return $columnLength === 1000;
    }

    public static function checkSchemaHealth(): bool
    {
        static::$schemaErrors = [];

        if (! self::healthCheckTableExists()) {
            static::$schemaErrors[] = self::HEALTH_ERROR_TABLE_DOES_NOT_EXIST;
        }

        if (! self::healthCheckColumnArgsLengthIsUpdated()) {
            static::$schemaErrors[] = self::HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED;
        }

        return empty(static::$schemaErrors);
    }

    public static function getSchemaHealthErrors(): array
    {
        return static::$schemaErrors;
    }

    public static function createTableIfNotExists()
    {
        if (self::healthCheckTableExists()) {
            return;
        }

        global $wpdb;

        $charsetCollate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE " . self::getTableName() . " (
            id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            cron_action_id bigint(20) UNSIGNED NOT NULL,
            post_id bigint(20) UNSIGNED NOT NULL,
            enabled tinyint(1) NOT NULL DEFAULT '0',
            scheduled_date datetime NOT NULL,
            created_at datetime NOT NULL,
            args varchar(1000) NOT NULL,
            PRIMARY KEY  (id),
            KEY post_id (post_id, id),
            KEY enabled_post_id (post_id, enabled, id),
            KEY cron_action_id (cron_action_id, id),
            KEY enabled_cron_action_id (cron_action_id, enabled, id)
        ) $charsetCollate;";

        if (! function_exists('dbDelta')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        // We are forced to suppress errors here because dbDelta() will run a "DESCRIBE"
        // query on the table that do not exist yet, and that will trigger an error.
        $suppressErrors = $wpdb->suppress_errors(true);
        $result = dbDelta($sql);
        $wpdb->suppress_errors($suppressErrors);

        if (! empty($result)) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log('PUBLISHPRESS FUTURE: Result of creating table ' . self::getTableName() . ': ' . implode("\n", $result));
        }
    }

    public static function dropTableIfExists()
    {
        if (! self::healthCheckTableExists()) {
            return;
        }

        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.SchemaChange
        $wpdb->query("DROP TABLE " . self::getTableName());
    }

    public static function fixSchema()
    {
        self::createTableIfNotExists();

        if (self::healthCheckColumnArgsLengthIsUpdated()) {
            return;
        }

        $hooks = Container::getInstance()->get(ServicesAbstract::HOOKS);
        $hooks->doAction(ExpiratorHooksAbstract::ACTION_MIGRATE_ARGS_LENGTH);
    }
}
