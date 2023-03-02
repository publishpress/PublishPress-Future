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

        $data = $model->getAll(
            $perPage,
            $currentPage,
            $this->get_orderby(),
            $this->get_order('DESC'),
            isset($_REQUEST['postType']) ? sanitize_key($_REQUEST['postType']) : '' // phpcs:ignore WordPress.Security.NonceVerification.Recommended
        );

        $this->items = $data;
    }

    public function get_columns()
    {
        return [
            'id' => __('ID'),
            'post_title' => __('Post', 'publishpress-future-pro'),
            'content' => __('Log', 'publishpress-future-pro'),
            'created_at' => __('Log date', 'publishpress-future-pro'),
        ];
    }

    public function get_hidden_columns()
    {
        return [];
    }

    public function get_sortable_columns()
    {
        return [
            'id' => ['id', false],
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
                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
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

    private function get_order($default = 'ASC')
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        return isset($_GET['order']) && in_array(strtoupper($_GET['order']), ['ASC', 'DESC'])
            ? strtoupper(sanitize_key($_GET['order'])) : $default;

        // phpcs:enable WordPress.Security.NonceVerification.Recommended
    }

    private function get_orderby($default = 'id')
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        return isset($_GET['orderby']) && in_array($_GET['orderby'], ['id', 'post_title', 'created_at'])
            ? sanitize_key($_GET['orderby']) : $default;
        // phpcs:enable WordPress.Security.NonceVerification.Recommended
    }

    protected function extra_tablenav( $which )
    {
        $postTypes = get_post_types(['public' => true], 'object');

        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $selected = isset($_GET['postType']) ? sanitize_key($_GET['postType']) : '';
        ?>
        <form method="get">
            <input type="hidden" name="page" value="<?php
            echo esc_attr(isset($_REQUEST['page']) ? sanitize_key($_REQUEST['page']) : ''); ?>"/>
            <input type="hidden" name="orderby" value="<?php
            echo esc_attr(isset($_REQUEST['orderby']) ? sanitize_key($_REQUEST['orderby']) : ''); ?>"/>
            <input type="hidden" name="order" value="<?php
            echo esc_attr(isset($_REQUEST['order']) ? sanitize_key($_REQUEST['order']) : ''); ?>"/>
            <input type="hidden" name="postType" value="<?php
            echo esc_attr(isset($_REQUEST['postType']) ? sanitize_key($_REQUEST['postType']) : ''); ?>"/>
            <input type="hidden" name="nonce" value="<?php
            echo esc_attr(wp_create_nonce('filter-workflow-logs')); ?>"/>
            <select name="postType">
                <option value="">All Post Types</option>
                <?php
                foreach ($postTypes as $postType) : ?>
                    <option value="<?php echo esc_attr($postType->name); ?>" <?php
                    selected($selected, $postType->name); ?>>
                        <?php echo esc_html__($postType->label, 'publihspress-future-pro'); ?>
                    </option>
                    <?php
                endforeach; ?>
            </select>
            <input type="submit" value="Filter" class="button"/>
        </form>
        <?php

        // phpcs:enable WordPress.Security.NonceVerification.Recommended
    }
}
