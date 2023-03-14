<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Tables;

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
    }

    /**
     * {@inheritDoc}
     */
    public function prepare_items()
    {
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

    public function column_status(array $row)
    {
        $icons = [
            \ActionScheduler_Store::STATUS_COMPLETE => 'dashicons dashicons-yes-alt action-scheduler-status-icon-complete',
            \ActionScheduler_Store::STATUS_PENDING  => 'dashicons dashicons-clock action-scheduler-status-icon-pending',
            \ActionScheduler_Store::STATUS_RUNNING  => 'dashicons dashicons-update action-scheduler-status-icon-running',
            \ActionScheduler_Store::STATUS_FAILED   => 'dashicons dashicons-warning action-scheduler-status-icon-failed',
            \ActionScheduler_Store::STATUS_CANCELED => 'dashicons dashicons-no action-scheduler-status-icon-canceled',
        ];

        $iconClass = 'dashicons dashicons-editor-help';
        if (isset($icons[$row['status_name']])) {
            $iconClass = $icons[$row['status_name']];
        }

        echo '<span class="' . $iconClass . '"></span> ' . $row['status'];
    }

//    /**
//     * Prints the logs entries inline. We do so to avoid loading Javascript and other hacks to show it in a modal.
//     *
//     * @param \ActionScheduler_LogEntry $log_entry
//     * @param \DateTimezone $timezone
//     * @return string
//     */
//    protected function get_log_entry_html( \ActionScheduler_LogEntry $log_entry, \DateTimezone $timezone ) {
//        $date = $log_entry->get_date();
//        $date->setTimezone( $timezone );
//        return sprintf( '<li><strong>%s</strong> %s</li>', esc_html( $date->format( 'Y-m-d H:i:s O' ) ), esc_html( $log_entry->get_message() ) );
//    }
//
//    /**
//     * Generates content for a single row of the table.
//     *
//     * @since 3.1.0
//     *
//     * @param object|array $item The current item
//     */
//    public function single_row( $item ) {
//        echo '<tr>';
//        $this->single_row_columns( $item );
//        echo '</tr>';
//        echo '<tr class="action-scheduler-log">';
//        echo '<td colspan="6">';
//
//        $log_entries_html = '<ol>';
//
//        $timezone = new \DateTimezone( 'UTC' );
//
//        foreach ( $item['log_entries'] as $log_entry ) {
//            $log_entries_html .= $this->get_log_entry_html( $log_entry, $timezone );
//        }
//
//        $log_entries_html .= '</ol>';
//        echo $log_entries_html;
//
//        echo '</td>';
//        echo '</tr>';
//    }

//    public function column_log_entries(array $row)
//    {
//        // echo the last item of the array $row['log_entries']
//        $last_log_entry = end($row['log_entries']);
//        $date = $last_log_entry->get_date();
//        $date->setTimezone(new \DateTimezone('UTC'));
//        echo sprintf('<strong>%s</strong> %s', esc_html($date->format('Y-m-d H:i:s O')), esc_html($last_log_entry->get_message()));
//        echo '<br>';
//        echo '<a href="#" class="action-scheduler-log-toggle">Show full log</a>';
//    }
}
