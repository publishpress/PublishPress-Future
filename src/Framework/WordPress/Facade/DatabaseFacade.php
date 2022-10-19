<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

class DatabaseFacade
{
    /**
     * @return string
     */
    public function getTablePrefix()
    {
        global $wpdb;

        return $wpdb->prefix;
    }

    /**
     * @param string $query
     * @param int $x
     * @param int $y
     *
     * @return string|null
     */
    public function getVar($query = null, $x = 0, $y = 0)
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_var($query, $x, $y);
    }

    /**
     * @param string $query
     *
     * @return string
     */
    public function prepare($query, ...$args)
    {
        global $wpdb;

        $functionArgs = func_get_args();

        return call_user_func_array([$wpdb, 'prepare'], $functionArgs);
    }

    public function escape($data)
    {
        return \esc_sql($data);
    }

    /**
     * @param string[]|string
     * @param bool
     *
     * @return array
     */
    public function modifyStructure($queries = '', $execute = true)
    {
        if (! function_exists('dbDelta')) {
            require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        }

        return \dbDelta($queries, $execute);
    }

    /**
     * @param string $query
     * @param string $output
     * @return array|object|null
     */
    public function getResults($query = null, $output = 'OBJECT')
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->get_results($query, $output);
    }

    /**
     * @param string $tableName
     *
     * @return void
     */
    public function dropTable($tableName)
    {
        global $wpdb;

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching
        $wpdb->query('DROP TABLE IF EXISTS `' . esc_sql($tableName) . '`');
    }

    /**
     * @param string $query
     *
     * @return int|bool
     */
    public function query($query)
    {
        global $wpdb;

    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
        return $wpdb->query($query);
    }
}
