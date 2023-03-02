<?php

namespace PublishPressFuturePro\Models;

class WorkflowLogModel
{
    // Table name
    protected const TABLE_NAME = 'ppfuture_workflow_log';

    public function getAll(
        int $perPage = 20,
        int $currentPage = 1,
        string $orderBy = 'id',
        string $order = 'ASC',
        string $postTypeFilter = null
    ): array {
        global $wpdb;

        $tableName = self::getTableName();

        $perPage = (int)$perPage;
        $currentPage = (int)$currentPage;
        $offset = $currentPage > 1 ? ($currentPage - 1) * $perPage : 0;

        $orderBy = in_array($orderBy, ['id', 'post_title', 'created_at']) ? $orderBy : 'id';
        $order = in_array($order, ['ASC', 'DESC']) ? $order : 'ASC';

        if (! empty($postTypeFilter)) {
            $postTypeFilter = sanitize_text_field($postTypeFilter);
            $postTypeFilter = $wpdb->esc_like($postTypeFilter);
            $postTypeFilter = "AND {$wpdb->posts}.post_type LIKE '%{$postTypeFilter}%'";
        } else {
            $postTypeFilter = '';
        }

        $sql = "
            SELECT {$tableName}.*, {$wpdb->posts}.post_title
            FROM {$tableName}
            LEFT JOIN {$wpdb->posts} ON {$wpdb->posts}.ID = {$tableName}.post_id
            WHERE 1 = 1 {$postTypeFilter}
            ORDER BY {$orderBy} {$order}
            LIMIT {$perPage}
            OFFSET {$offset};
        ";

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_results($sql);
    }

    public function countAll(): int
    {
        global $wpdb;

        $tableName = self::getTableName();

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
        return (int) $wpdb->get_var("SELECT COUNT(*) FROM $tableName");
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

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        $wpdb->delete(
            self::getTableName(),
            ['id' => (int) $logId],
            ['%d']
        );
    }

    public function deleteAll(): void
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        $wpdb->query("TRUNCATE TABLE " . self::getTableName());
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

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        $wpdb->query("DROP TABLE IF EXISTS " . self::getTableName());
    }
}
