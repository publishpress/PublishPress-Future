<?php

namespace PublishPress\Future\Modules\Expirator\Schemas;

defined('ABSPATH') or die('Direct access not allowed.');

class ActionArgsSchema
{
    /**
     * @return string
     */
    public static function getTableName()
    {
        global $wpdb;
        return $wpdb->prefix . 'ppfuture_actions_args';
    }

    public static function tableExists()
    {
        $tableName = self::getTableName();

        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $table = $wpdb->get_var("SHOW TABLES LIKE '$tableName'");

        return $table === $tableName;
    }

    public static function createTableIfNotExists()
    {
        if (self::tableExists()) {
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
            args varchar(250) NOT NULL,
            PRIMARY KEY  (id),
            KEY post_id (post_id, id),
            KEY enabled_post_id (post_id, enabled, id),
            KEY cron_action_id (cron_action_id, id),
            KEY enabled_cron_action_id (cron_action_id, enabled, id)
        ) ENGINE=InnoDB $charsetCollate;";

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
        if (! self::tableExists()) {
            return;
        }

        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        $wpdb->query("DROP TABLE " . self::getTableName());
    }
}
