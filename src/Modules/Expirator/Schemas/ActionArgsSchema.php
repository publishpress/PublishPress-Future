<?php

namespace PublishPressFuture\Modules\Expirator\Schemas;

class ActionArgsSchema
{
    protected const TABLE_NAME = 'ppfuture_actions_args';

    public static function getTableName(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::TABLE_NAME;
    }

    protected static function tableExists($tableName)
    {
        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        $table = $wpdb->get_var("SHOW TABLES LIKE '$tableName'");

        return $table === $tableName;
    }

    public static function createTableIfNotExists(): void
    {
        if (self::tableExists(self::getTableName())) {
            return;
        }

        global $wpdb;

        $charsetCollate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE " . self::getTableName() . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            cron_action_id bigint(20) NOT NULL,
            post_id bigint(20) NOT NULL,
            scheduled_date datetime NOT NULL,
            created_at datetime NOT NULL,
            args varchar(250) NOT NULL,
            PRIMARY KEY  (id),
            KEY post_id (post_id, id),
            KEY cron_action_id (cron_action_id, id)
        ) ENGINE=InnoDB $charsetCollate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public static function dropTableIfExists(): void
    {
        if (!self::tableExists(self::getTableName())) {
            return;
        }

        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        $wpdb->query("DROP TABLE " . self::getTableName());
    }
}
