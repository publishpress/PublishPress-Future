<?php

/*
 * @copyright Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuturePro\Tables;

use PublishPressFuturePro\Models\WorkflowLogModel;
use WP_List_Table;

class WorkflowLogTable extends WP_List_Table
{
    public function __construct()
    {
        parent::__construct([
            'singular' => 'workflow_log',
            'plural' => 'workflow_logs',
            'ajax' => false
        ]);
    }

    public function prepare_items()
    {
        global $wpdb;
        $tableName = WorkflowLogModel::getTableName();
        $logs = $wpdb->get_results("SELECT * FROM $tableName");

        foreach ($logs as &$log) {
            $log->post = get_the_title($log->post_id) . ' [' . $log->post_id . ']';
        }

        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = [$columns, $hidden, $sortable];
        $this->items = $logs;
    }

    public function get_columns()
    {
        return [
            'id' => __('ID'),
            'post' => __('Post', 'publishpress-future-pro'),
            'content' => __('Log', 'publishpress-future-pro'),
            'created_at' => __('Created At', 'publishpress-future-pro'),
        ];
    }

    public function get_hidden_columns()
    {
        return [];
    }

    public function get_sortable_columns()
    {
        return [
            'post' => ['post', false],
            'created_at' => ['created_at', false],
        ];
    }

    public function column_default($item, $column_name)
    {
        switch ($column_name) {
            case 'id':
            case 'post':
            case 'content':
            case 'created_at':
                return $item->$column_name;
            default:
                return print_r($item, true);
        }
    }
}
