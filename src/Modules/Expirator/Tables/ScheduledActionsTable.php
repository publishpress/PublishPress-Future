<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Tables;

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;

class ScheduledActionsTable extends \ActionScheduler_ListTable
{
    public function __construct(
        \ActionScheduler_Store $store,
        \ActionScheduler_Logger $logger,
        \ActionScheduler_QueueRunner $runner
    ) {
        parent::__construct($store, $logger, $runner);

        $this->table_header = __('Future Actions', 'post-expirator');

        unset($this->columns['group']);
        $this->columns['hook'] = __('Action', 'post-expirator');
    }

    /**
     * {@inheritDoc}
     */
    public function prepare_items()
    {
        $this->process_bulk_action();
        $this->process_row_actions();

        $this->prepare_column_headers();

        $per_page = $this->get_items_per_page($this->get_per_page_option_name(), $this->items_per_page);

        $query = array(
            'per_page' => $per_page,
            'offset' => $this->get_items_offset(),
            'status' => $this->get_request_status(),
            'orderby' => $this->get_request_orderby(),
            'order' => $this->get_request_order(),
            'search' => $this->get_request_search_query(),
            'group' => CronToWooActionSchedulerAdapter::SCHEDULED_ACTION_GROUP,
        );

        /**
         * Change query arguments to query for past-due actions.
         * Past-due actions have the 'pending' status and are in the past.
         * This is needed because registering 'past-due' as a status is overkill.
         */
        if ('past-due' === $this->get_request_status()) {
            $query['status'] = \ActionScheduler_Store::STATUS_PENDING;
            $query['date'] = as_get_datetime_object();
        }

        $this->items = array();

        $total_items = $this->store->query_actions($query, 'count');

        $status_labels = $this->store->get_status_labels();

        foreach ($this->store->query_actions($query) as $action_id) {
            try {
                $action = $this->store->fetch_action($action_id);
            } catch (\Exception $e) {
                continue;
            }

            if (is_a($action, 'ActionScheduler_NullAction')) {
                continue;
            }

            $this->items[$action_id] = array(
                'ID' => $action_id,
                'hook' => $action->get_hook(),
                'status_name' => $this->store->get_status($action_id),
                'status' => $status_labels[$this->store->get_status($action_id)],
                'args' => $action->get_args(),
                'group' => $action->get_group(),
                'log_entries' => $this->logger->get_logs($action_id),
                'claim_id' => $this->store->get_claim_id($action_id),
                'recurrence' => $this->get_recurrence($action),
                'schedule' => $action->get_schedule(),
            );
        }

        $this->set_pagination_args(array(
            'total_items' => $total_items,
            'per_page' => $per_page,
            'total_pages' => ceil($total_items / $per_page),
        ));
    }

    protected function extra_action_counts()
    {
        $extra_actions = array();

        $pastdue_action_counts = ( int )$this->store->query_actions([
            'status' => \ActionScheduler_Store::STATUS_PENDING,
            'date' => as_get_datetime_object(),
            'group' => CronToWooActionSchedulerAdapter::SCHEDULED_ACTION_GROUP,
        ], 'count');

        if ($pastdue_action_counts) {
            $extra_actions['past-due'] = $pastdue_action_counts;
        }

        /**
         * Allows 3rd party code to add extra action counts (used in filters in the list table).
         *
         * @param $extra_actions array Array with format action_count_identifier => action count.
         * @since 3.5.0
         */
        return apply_filters('action_scheduler_extra_action_counts', $extra_actions);
    }

    protected function update_status_counts()
    {
        $this->status_counts = $this->store->action_counts();

        // Update the status count
        foreach ($this->status_counts as $status => $count) {
            $query = array(
                'status' => $status,
                'group' => CronToWooActionSchedulerAdapter::SCHEDULED_ACTION_GROUP,
            );
            $this->status_counts[$status] = $this->store->query_actions($query, 'count');
        }

        $this->status_counts = array_merge($this->status_counts, $this->extra_action_counts());
    }

    protected function display_filter_by_status()
    {
        $this->update_status_counts();

        $status_list_items = array();
        $request_status = $this->get_request_status();

        // Helper to set 'all' filter when not set on status counts passed in.
        if (! isset($this->status_counts['all'])) {
            $this->status_counts = array('all' => array_sum($this->status_counts)) + $this->status_counts;
        }

        foreach ($this->status_counts as $status_name => $count) {
            if (0 === $count) {
                continue;
            }

            if ($status_name === $request_status || (empty($request_status) && 'all' === $status_name)) {
                $status_list_item = '<li class="%1$s"><a href="%2$s" class="current">%3$s</a> (%4$d)</li>';
            } else {
                $status_list_item = '<li class="%1$s"><a href="%2$s">%3$s</a> (%4$d)</li>';
            }

            $status_filter_url = ('all' === $status_name) ? remove_query_arg('status') : add_query_arg(
                'status',
                $status_name
            );
            $status_filter_url = remove_query_arg(array('paged', 's'), $status_filter_url);
            $status_list_items[] = sprintf(
                $status_list_item,
                esc_attr($status_name),
                esc_url($status_filter_url),
                esc_html(ucfirst($status_name)),
                absint($count)
            );
        }

        if ($status_list_items) {
            echo '<ul class="subsubsub">';
            echo implode(" | \n", $status_list_items); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo '</ul>';
        }
    }

    public function column_status(array $row)
    {
        $icons = [
            \ActionScheduler_Store::STATUS_COMPLETE => 'dashicons dashicons-yes-alt action-scheduler-status-icon-complete',
            \ActionScheduler_Store::STATUS_PENDING => 'dashicons dashicons-clock action-scheduler-status-icon-pending',
            \ActionScheduler_Store::STATUS_RUNNING => 'dashicons dashicons-update action-scheduler-status-icon-running',
            \ActionScheduler_Store::STATUS_FAILED => 'dashicons dashicons-warning action-scheduler-status-icon-failed',
            \ActionScheduler_Store::STATUS_CANCELED => 'dashicons dashicons-marker action-scheduler-status-icon-canceled',
        ];

        $iconClass = 'dashicons dashicons-editor-help';
        if (isset($icons[$row['status_name']])) {
            $iconClass = $icons[$row['status_name']];
        }

        echo '<span class="' . esc_attr($iconClass) . '"></span> ' . esc_html($row['status']);
    }

    public function column_hook(array $row)
    {
//        $container = Container::getInstance();
//        $modelFactory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);

        if ($row['hook'] === 'publishpress_future/run_workflow' && isset($row['args']['workflow']) && $row['args']['workflow'] === 'expire') {
//            $model = $modelFactory($row['args']['post_id']);
//            $action = $model->getExpirationAction();
//
//            echo esc_html($action->getLabel());
//            return;
        }

        $columnHtml = esc_html($row['hook'] . " [{$row['ID']}]");
        $columnHtml .= $this->maybe_render_actions($row, 'hook');

        echo $columnHtml;
    }
//
//    /**
//     * This method is overriding the parent method to remove the wp_safe_redirect call.
//     * Calling redirect on our admin pages cause a fatal error because output is already
//     * written, probably by the Upgrade to Pro banner coming from our libraries.
//     *
//     * @return void
//     */
//    public function process_actions() {
//        $this->process_bulk_action();
//        $this->process_row_actions();
//    }
//
//    /**
//     * This method is overriding the parent method to remove the wp_safe_redirect call.
//     * Calling redirect on our admin pages cause a fatal error because output is already
//     * written, probably by the Upgrade to Pro banner coming from our libraries.
//     * We might see a fatal error if the user refresh the browser with the same URL, because
//     * the action will be executed again and the selected row was already deleted.
//     */
//    protected function process_bulk_action() {
//        global $wpdb;
//        // Detect when a bulk action is being triggered.
//        $action = $this->current_action();
//        if ( ! $action ) {
//            return;
//        }
//
//        check_admin_referer( 'bulk-' . $this->_args['plural'] );
//
//        $method = 'bulk_' . $action;
//        if ( array_key_exists( $action, $this->bulk_actions ) && is_callable( array( $this, $method ) ) && ! empty( $_GET['ID'] ) && is_array( $_GET['ID'] ) ) {
//            $ids_sql = '(' . implode( ',', array_fill( 0, count( $_GET['ID'] ), '%s' ) ) . ')';
//            $id      = array_map( 'absint', $_GET['ID'] );
//            $this->$method( $id, $wpdb->prepare( $ids_sql, $id ) ); //phpcs:ignore WordPress.DB.PreparedSQL
//        }
//    }
}
