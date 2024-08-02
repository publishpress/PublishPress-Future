<?php

namespace PublishPress\Future\Modules\Expirator\Schemas;

use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\TableSchemaInterface;

defined('ABSPATH') or die('Direct access not allowed.');

abstract class ActionArgsSchema implements TableSchemaInterface
{
    const HEALTH_ERROR_TABLE_DOES_NOT_EXIST = 'table_does_not_exist';
    const HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED = 'column_args_length_not_updated';

    public static $schemaErrors = [];

    public static function getTableName(): string
    {
        global $wpdb;

        return $wpdb->prefix . 'ppfuture_actions_args';
    }

    public static function isTableHealthy(): bool
    {
        static::$schemaErrors = [];

        if (! self::isTableExistent()) {
            static::$schemaErrors[self::HEALTH_ERROR_TABLE_DOES_NOT_EXIST] = __(
                'The table _ppfuture_actions_args does not exist.',
                'post-expirator'
            );
        }

        if (! self::checkColumnArgsLengthIs1000()) {
            static::$schemaErrors[self::HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED] = __(
                'The column args length was not updated to 1000.',
                'post-expirator'
            );
        }

        $indexesErrors = self::checkTableIndexes();
        if (! empty($indexesErrors)) {
            static::$schemaErrors['missing_indexes'] = __(
                'The table indexes are different from the expected: ',
                'post-expirator'
            ) . implode('; ', $indexesErrors);
        }

        return empty(static::$schemaErrors);
    }

    public static function isTableExistent(): bool
    {
        $tableName = self::getTableName();

        global $wpdb;
        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $table = $wpdb->get_var("SHOW TABLES LIKE '$tableName'");

        return $table === $tableName;
    }

    public static function fixTable(): void
    {
        if (! self::isTableExistent()) {
            self::createTable();
        }

        if (! self::checkColumnArgsLengthIs1000()) {
            // FIXME: Use DI here
            $hooks = Container::getInstance()->get(ServicesAbstract::HOOKS);
            $hooks->doAction(ExpiratorHooksAbstract::ACTION_MIGRATE_ARGS_LENGTH);
        }

        if (! empty(self::checkTableIndexes())) {
            self::fixMissedIndexes();
        }
    }

    public static function getErrors(): array
    {
        return static::$schemaErrors;
    }

    public static function createTable(): bool
    {
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

        if (empty($result)) {
            return false;
        }

        return isset($result[self::getTableName()])
            && $result[self::getTableName()] === "Created table " . self::getTableName();
    }

    public static function dropTable(): bool
    {
        global $wpdb;

        $result = $wpdb->query("DROP TABLE " . self::getTableName());

        return (bool)$result;
    }

    private static function checkColumnArgsLengthIs1000()
    {
        global $wpdb;

        $tableName = self::getTableName();
        $dbName = DB_NAME;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $columnLength = (int)$wpdb->get_var("SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.`COLUMNS` WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = '$tableName' AND COLUMN_NAME = 'args'");

        return $columnLength === 1000;
    }

    private static function getTableIndexes()
    {
        global $wpdb;

        $tableName = self::getTableName();
        $dbName = DB_NAME;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $indexes = $wpdb->get_results("SELECT * FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = '$tableName'");
        $mappedIndexes = [];

        foreach ($indexes as $index) {
            $indexName = $index->INDEX_NAME;
            $columnName = $index->COLUMN_NAME;

            if (! isset($mappedIndexes[$indexName])) {
                $mappedIndexes[$indexName] = [];
            }

            $mappedIndexes[$indexName][] = $columnName;
        }

        return $mappedIndexes;
    }

    private static function getExpectedTableIndexes()
    {
        return [
            'PRIMARY' => ['id'],
            'post_id' => ['post_id', 'id'],
            'enabled_post_id' => ['post_id', 'enabled', 'id'],
            'cron_action_id' => ['cron_action_id', 'id'],
            'enabled_cron_action_id' => ['cron_action_id', 'enabled', 'id'],
        ];
    }

    private static function checkTableIndexes(): array
    {
        global $wpdb;

        $errors = [];

        $indexes = self::getTableIndexes();
        $expectedIndexes = self::getExpectedTableIndexes();

        foreach ($expectedIndexes as $indexName => $expectedColumns) {
            if (! isset($indexes[$indexName])) {
                $errors[] = 'Missed index: ' . $indexName;

                continue;
            }

            $expectedColumnsString = implode(', ', $expectedColumns);
            $columnsString = implode(', ', $indexes[$indexName]);

            if ($columnsString !== $expectedColumnsString) {
                $errors[] = 'Index ' . $indexName . ' has different columns: [' . $columnsString . ']. Expected: [' . $expectedColumnsString . ']';
            }
        }

        return $errors;
    }

    private static function fixMissedIndexes()
    {
        global $wpdb;

        $indexes = self::getTableIndexes();
        $expectedIndexes = self::getExpectedTableIndexes();
        $wpdb->query("SET foreign_key_checks = 0");

        foreach ($expectedIndexes as $indexName => $expectedColumns) {
            $indexExists = array_key_exists($indexName, $indexes);
            $columns = $indexes[$indexName] ?? [];

            if ($indexExists) {
                $expectedColumnsString = implode(', ', $expectedColumns);
                $columnsString = implode(', ', $columns);

                if ($columnsString !== $expectedColumnsString) {
                    // Drop the index for recreation
                    $wpdb->query("DROP INDEX `$indexName` ON " . self::getTableName());
                    $indexExists = false;
                }
            }

            if (! $indexExists) {
                $columns = implode(', ', $expectedColumns);
                $unique = $indexName === 'PRIMARY' ? 'UNIQUE' : '';
                $wpdb->query("CREATE $unique INDEX `$indexName` ON " . self::getTableName() . " ($columns)");
            }
        }
        $wpdb->query("SET foreign_key_checks = 1");
    }

    // Deprecated methods

    /**
     * @deprecated 3.1.4 Use isTableExistent() instead.
     */
    public static function tableExists()
    {
        return self::isTableExistent();
    }

    /**
     * @deprecated 3.4.3 Use isTableHealthy() instead.
     */
    public static function healthCheckTableExists(): bool
    {
        return self::isTableExistent();
    }

    /**
     * @deprecated 3.4.3 Use isHealthy() instead.
     */
    public static function checkSchemaHealth(): bool
    {
        return self::isTableHealthy();
    }

    /**
     * @deprecated 3.4.3 Use isTableExistent and createTable() instead.
     */
    public static function createTableIfNotExists()
    {
        if (self::isTableExistent()) {
            return;
        }

        self::createTable();
    }

    /**
     * @deprecated 3.4
     */
    public static function fixSchema()
    {
        self::fixTable();
    }

    /**
     * @deprecated 3.4.3 Use getErrors() instead.
     */
    public static function getSchemaHealthErrors(): array
    {
        return self::getErrors();
    }
}
