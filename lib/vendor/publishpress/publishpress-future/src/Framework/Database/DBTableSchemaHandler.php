<?php

namespace PublishPress\Future\Framework\Database;

use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaHandlerInterface;
use wpdb;

defined('ABSPATH') or die('Direct access not allowed.');

class DBTableSchemaHandler implements DBTableSchemaHandlerInterface
{
    /**
     * @var wpdb
     */
    private $wpdb;

    /**
     * @var string
     */
    private $tableName;

    /**
     * @var array
     */
    private $schemaErrors = [];

    public function __construct($wpdb)
    {
        $this->wpdb = $wpdb;
    }

    public function setTableName(string $tableNameWithoutPrefix): void
    {
        $this->tableName = $this->getTablePrefix() . $tableNameWithoutPrefix;
    }

    public function getTablePrefix(): string
    {
        return $this->wpdb->prefix;
    }

    public function getTableName(): string
    {
        return $this->tableName;
    }

    public function isTableExistent(): bool
    {
        $tableName = $this->getTableName();

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $table = $this->wpdb->get_var("SHOW TABLES LIKE '$tableName'");

        return $table === $tableName;
    }

    public function createTable(array $columns, array $indexes): bool
    {
        $charsetCollate = $this->wpdb->get_charset_collate();
        $tableName = $this->getTableName();

        $columnsSql = '';
        foreach ($columns as $columnName => $columnDefinition) {
            $columnsSql .= "$columnName $columnDefinition, ";
        }

        $indexesSql = '';
        foreach ($indexes as $indexName => $indexColumns) {
            $indexColumns = implode(', ', $indexColumns);

            if ($indexName === 'PRIMARY') {
                $indexesSql .= "PRIMARY KEY ($indexColumns), ";
                continue;
            }

            $indexesSql .= "KEY `$indexName` ($indexColumns), ";
        }
        $indexesSql = rtrim($indexesSql, ', ');

        $sql = "CREATE TABLE `$tableName` (
            $columnsSql
            $indexesSql
        ) $charsetCollate;";

        if (! function_exists('dbDelta')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        // We are forced to suppress errors here because dbDelta() will run a "DESCRIBE"
        // query on the table that do not exist yet, and that will trigger an error.
        $suppressErrors = $this->wpdb->suppress_errors(true);
        $result = dbDelta($sql);
        $this->wpdb->suppress_errors($suppressErrors);

        if (empty($result)) {
            return false;
        }

        return isset($result["`$tableName`"])
            && $result["`$tableName`"] === "Created table `$tableName`";
    }

    public function dropTable(): bool
    {
        $tableName = $this->getTableName();

        $result = $this->wpdb->query("DROP TABLE `$tableName`");

        return (bool)$result;
    }

    public function getColumnLength(string $column): int
    {
        $tableName = $this->getTableName();
        $dbName = DB_NAME;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $columnLength = $this->wpdb->get_var(
            "SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.`COLUMNS` WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = '$tableName' AND COLUMN_NAME = '$column'"
        );

        return (int) $columnLength;
    }

    private function getTableIndexes()
    {
        $tableName = $this->getTableName();
        $dbName = DB_NAME;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery
        $indexes = $this->wpdb->get_results("SELECT * FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = '$dbName' AND TABLE_NAME = '$tableName'");
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

    public function checkTableIndexes(array $expectedIndexes): array
    {
        $errors = [];

        $indexes = $this->getTableIndexes();

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

        if (count($indexes) !== count($expectedIndexes)) {
            $errors[] = 'There are more indexes than expected';
        }

        return $errors;
    }

    public function registerError(string $code, string $error): void
    {
        $this->schemaErrors[$code] = $error;
    }

    public function getErrors(): array
    {
        return $this->schemaErrors;
    }

    public function resetErrors(): void
    {
        $this->schemaErrors = [];
    }

    public function hasErrors(): bool
    {
        return ! empty($this->schemaErrors);
    }

    public function fixIndexes(array $expectedIndexes): void
    {
        $indexes = $this->getTableIndexes();
        $this->wpdb->query("SET foreign_key_checks = 0");

        foreach ($expectedIndexes as $indexName => $expectedColumns) {
            $indexExists = array_key_exists($indexName, $indexes);
            $columns = $indexes[$indexName] ?? [];

            if ($indexExists) {
                $expectedColumnsString = implode(', ', $expectedColumns);
                $columnsString = implode(', ', $columns);

                if ($columnsString !== $expectedColumnsString) {
                    // Drop the index for recreation
                    $this->wpdb->query("DROP INDEX `$indexName` ON " . self::getTableName());
                    $indexExists = false;
                }
            }

            if (! $indexExists) {
                $columns = implode(', ', $expectedColumns);
                $unique = $indexName === 'PRIMARY' ? 'UNIQUE' : '';
                $this->wpdb->query("CREATE $unique INDEX `$indexName` ON " . self::getTableName() . " ($columns)");
            }
        }

        // Drop extra indexes
        foreach ($indexes as $indexName => $columns) {
            if (! array_key_exists($indexName, $expectedIndexes)) {
                $this->wpdb->query("DROP INDEX `$indexName` ON " . self::getTableName());
            }
        }

        $this->wpdb->query("SET foreign_key_checks = 1");
    }

    public function changeColumn(string $column, string $definition): void
    {
        $tableName = $this->getTableName();
        $this->wpdb->query("ALTER TABLE `$tableName` MODIFY COLUMN `$column` $definition");
    }
}
