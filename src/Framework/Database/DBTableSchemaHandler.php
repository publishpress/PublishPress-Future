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
        $table = $this->wpdb->get_var(
            $this->wpdb->prepare(
                "SHOW TABLES LIKE %s",
                $tableName
            )
        );

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

        $result = $this->wpdb->query(
            $this->wpdb->prepare( // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
                "DROP TABLE IF EXISTS %i",
                $tableName // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
            )
        );

        return (bool)$result;
    }

    public function getColumnLength(string $column): int
    {
        $tableName = $this->getTableName();
        $dbName = DB_NAME;

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared
        $columnLength = $this->wpdb->get_var(
            $this->wpdb->prepare( // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
                "SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.`COLUMNS` WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s",
                $dbName,
                $tableName,
                $column
            )
        );
        // phpcs:enable

        return (int) $columnLength;
    }

    private function getTableIndexes()
    {
        $tableName = $this->getTableName();
        $dbName = DB_NAME;

        // phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.NotPrepared
        $indexes = $this->wpdb->get_results(
            $this->wpdb->prepare( // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
                "SELECT * FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s",
                $dbName,
                $tableName
            )
        );
        // phpcs:enable

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

    public function checkTableColumns(array $expectedColumns): array
    {
        $errors = [];

        $columns = $this->getTableColumns();
        $columnsDefinitions = $this->getTableColumnDefinitions();

        foreach ($expectedColumns as $columnName => $expectedDefinition) {
            // Check if column exists
            if (!in_array($columnName, $columns)) {
                $errors[] = 'Column "' . $columnName . '" is missing';
                continue;
            }

            // Parse the expected type info
            $typeInfo = $this->parseColumnType($expectedDefinition);
            $basicType = $typeInfo['type'];

            // Get the current column basic type
            $currentType = $columnsDefinitions[$columnName]->Type;
            $currentTypeInfo = $this->parseColumnType($currentType);
            $currentBasicType = $currentTypeInfo['type'];

            // Compare basic types (without size)
            if ($currentBasicType !== $basicType) {
                $errors[] = 'Column "' . $columnName . '" has wrong type: ' . $currentBasicType . '. Expected: ' . $basicType;
                continue;
            }

            // Check size constraints for relevant types
            if (!$this->checkColumnSize($columnName, $expectedDefinition)) {
                $errors[] = 'Column "' . $columnName . '" has wrong size. Expected: ' . $expectedDefinition . ', Got: ' . $currentType;
            }
        }

        return $errors;
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

        if (count($indexes) > count($expectedIndexes)) {
            $errors[] = 'There are more indexes than expected';
        } elseif (count($indexes) < count($expectedIndexes)) {
            $errors[] = 'There are less indexes than expected';
        }

        return $errors;
    }

    public function registerError(string $code, string $error): void
    {
        $this->schemaErrors[] = $error;
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
                    // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
                    // Drop the index for recreation
                    $this->wpdb->query(
                        $this->wpdb->prepare(
                            "DROP INDEX %i ON %i",
                            $indexName,
                            $this->getTableName()
                        )
                    );
                    // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared

                    $indexExists = false;
                }
            }

            if (! $indexExists) {
                $columns = implode(', ', $expectedColumns);
                $unique = $indexName === 'PRIMARY' ? 'UNIQUE' : '';
                // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                $this->wpdb->query(
                    $this->wpdb->prepare(
                        "CREATE $unique INDEX %i ON %i ($columns)",
                        $indexName,
                        $this->getTableName()
                    )
                );
                // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
            }
        }

        // Drop extra indexes
        foreach ($indexes as $indexName => $columns) {
            if (! array_key_exists($indexName, $expectedIndexes)) {
                // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
                $this->wpdb->query(
                    $this->wpdb->prepare(
                        "DROP INDEX %i ON %i",
                        $indexName,
                        $this->getTableName()
                    )
                );
                // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
            }
        }

        $this->wpdb->query("SET foreign_key_checks = 1");
    }

    public function getTableColumns(): array
    {
        $columns = $this->getTableColumnDefinitions();

        return array_column($columns, 'Field');
    }

    public function getTableColumnDefinitions(): array
    {
        $tableName = $this->getTableName();
        $columns = $this->wpdb->get_results(
            $this->wpdb->prepare(
                "SHOW COLUMNS FROM %i",
                $tableName
            )
        );

        $columnsDefinitions = [];
        foreach ($columns as $column) {
            $columnsDefinitions[$column->Field] = $column;
        }

        return $columnsDefinitions;
    }

    public function fixColumns(array $columns): void
    {
        $tableColumns = $this->getTableColumns();

        foreach ($columns as $columnName => $columnDefinition) {
            if (! in_array($columnName, $tableColumns)) {
                $this->addColumn($columnName, $columnDefinition);
            } else {
                $this->changeColumn($columnName, $columnDefinition);
            }
        }
    }

    public function addColumn(string $columnName, string $columnDefinition): void
    {
        $tableName = $this->getTableName();
        $this->wpdb->query("ALTER TABLE `$tableName` ADD COLUMN `$columnName` $columnDefinition");
    }

    public function changeColumn(string $column, string $definition): void
    {
        $tableName = $this->getTableName();
        $this->wpdb->query("ALTER TABLE `$tableName` MODIFY COLUMN `$column` $definition");
    }

    public function checkColumnSize(string $column, string $expectedType): bool
    {
        $tableName = $this->getTableName();
        $dbName = DB_NAME;

        // Parse expected type to extract size information
        $typeInfo = $this->parseColumnType($expectedType);
        $typeName = $typeInfo['type'];
        $expectedSize = $typeInfo['size'] ?? null;

        if (empty($expectedSize)) {
            return true; // No size to check
        }

        // For character types (VARCHAR, CHAR, etc.)
        if (in_array($typeName, ['varchar', 'char', 'text', 'tinytext', 'mediumtext', 'longtext'])) {
            $actualLength = $this->getColumnLength($column);
            return $actualLength == $expectedSize;
        }

        // For numeric types (DECIMAL, NUMERIC with precision/scale)
        if (in_array($typeName, ['decimal', 'numeric'])) {
            list($precision, $scale) = explode(',', $expectedSize);
            $precision = (int)trim($precision);
            $scale = (int)trim($scale);

            // phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
            $columnInfo = $this->wpdb->get_row(
                $this->wpdb->prepare(
                    "SELECT NUMERIC_PRECISION, NUMERIC_SCALE FROM information_schema.COLUMNS
                    WHERE TABLE_SCHEMA = %s AND TABLE_NAME = %s AND COLUMN_NAME = %s",
                    $dbName,
                    $tableName,
                    $column
                )
            );
            // phpcs:enable

            return $columnInfo && (int)$columnInfo->NUMERIC_PRECISION === $precision &&
                   (int)$columnInfo->NUMERIC_SCALE === $scale;
        }

        // For integer types where display width doesn't affect storage but might be a compatibility concern
        if (in_array($typeName, ['tinyint', 'smallint', 'mediumint', 'int', 'bigint'])) {
            // For these types, we could check NUMERIC_PRECISION but it's less critical
            // since the display width doesn't affect storage capacity
            return true;
        }

        return true;
    }

    private function parseColumnType(string $typeDefinition): array
    {
        $typeDefinition = strtolower(trim($typeDefinition));

        if (preg_match('/^([a-z]+)(?:\(([^)]+)\))?/', $typeDefinition, $matches)) {
            return [
                'type' => $matches[1],
                'size' => $matches[2] ?? null,
            ];
        }

        return ['type' => $typeDefinition];
    }
}
