<?php

namespace PublishPressFuturePro\Models;

class WorkflowLogModel
{
    // Table name
    protected const TABLE_NAME = 'ppfuture_workflow_log';

    public function getAll(int $perPage = 20, int $currentPage = 1, $orderBy = 'id', $order = 'ASC'): array
    {
        global $wpdb;

        $tableName = self::getTableName();

        $perPage = (int)$perPage;
        $currentPage = (int)$currentPage;
        $offset = $currentPage > 1 ? ($currentPage - 1) * $perPage : 0;

        $orderBy = in_array($orderBy, ['id', 'post_title', 'created_at']) ? $orderBy : 'id';
        $order = in_array($order, ['ASC', 'DESC']) ? $order : 'ASC';

        $sql = "
            SELECT {$tableName}.*, {$wpdb->posts}.post_title
            FROM {$tableName}
            LEFT JOIN {$wpdb->posts} ON {$wpdb->posts}.ID = {$tableName}.post_id
            ORDER BY {$orderBy} {$order}
            LIMIT {$perPage}
            OFFSET {$offset};
        ";

        return $wpdb->get_results($sql);
    }

    public function countAll(): int
    {
        global $wpdb;

        $tableName = self::getTableName();

        $sql = "SELECT COUNT(*) FROM $tableName";

        return $wpdb->get_var($sql);
    }

    public function add(int $postId, string $log): int
    {
        global $wpdb;

        $wpdb->insert(
            self::getTableName(),
            [
                'post_id' => $postId,
                'blog_id' => get_current_blog_id(),
                'content' => $log,
                'created_at' => current_time('mysql'),
            ],
            [
                '%d',
                '%d',
                '%s',
                '%s',
            ]
        );

        return $wpdb->insert_id;
    }

    public function delete(int $logId): void
    {
        global $wpdb;

        $wpdb->delete(
            self::getTableName(),
            ['id' => $logId],
            ['%d']
        );
    }

    public static function getTableName(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::TABLE_NAME;
    }

    public static function createTableIfNotExists(): void
    {
        global $wpdb;

        $charsetCollate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS " . self::getTableName() . " (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            blog_id int(9) NOT NULL,
            post_id bigint(20) NOT NULL,
            content text NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY blog_post_id (blog_id, post_id, id)
        ) ENGINE=InnoDB $charsetCollate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public static function dropTableIfExists(): void
    {
        global $wpdb;

        $wpdb->query("DROP TABLE IF EXISTS " . self::getTableName());
    }
}
