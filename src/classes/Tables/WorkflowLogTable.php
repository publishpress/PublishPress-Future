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
        $columns = $this->get_columns();
        $hidden = $this->get_hidden_columns();
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = [$columns, $hidden, $sortable];

        $model = new WorkflowLogModel();

        $perPage = $this->get_items_per_page('records_per_page', 20);
        $currentPage = $this->get_pagenum();

        $totalItems = $model->countAll();

        $this->set_pagination_args([
            'total_items' => $totalItems,
            'per_page' => $perPage
        ]);

        $data = $model->getAll($perPage, $currentPage, $this->get_orderby(), $this->get_order('DESC'));

        $this->items = $data;
    }

    public function get_columns()
    {
        return [
            'id' => __('ID'),
            'post_title' => __('Post', 'publishpress-future-pro'),
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
            'post_title' => ['post_title', false],
            'created_at' => ['created_at', false],
        ];
    }

    public function column_default($item, $column_name)
    {
        switch ($column_name) {
            case 'id':
            case 'post_title':
            case 'content':
            case 'created_at':
                return $item->$column_name;
            default:
                return print_r($item, true);
        }
    }

    public function column_post_title($item)
    {
        $actions = [
            'view' => sprintf(
                '<a href="%s">%s</a>',
                get_permalink($item->post_id),
                __('View Post', 'publishpress-future-pro')
            ),
            'edit' => sprintf(
                '<a href="%s">%s</a>',
                get_edit_post_link($item->post_id),
                __('Edit Post', 'publishpress-future-pro')
            ),
        ];

        return sprintf(
            '%1$s %2$s',
            $item->post_title . ' [' . $item->post_id . ']',
            $this->row_actions($actions)
        );
    }
}
