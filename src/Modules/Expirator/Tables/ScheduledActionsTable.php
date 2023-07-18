<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Tables;

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class ScheduledActionsTable extends \ActionScheduler_ListTable
{
    /**
     * @var \PublishPress\Future\Core\HookableInterface
     */
    private $hooksFacade;

    /**
     * Array of seconds for common time periods, like week or month, alongside an internationalised string representation, i.e. "Day" or "Days"
     *
     * @var array
     */
    private static $time_periods;

    public function __construct(
        \ActionScheduler_Store $store,
        \ActionScheduler_Logger $logger,
        \ActionScheduler_QueueRunner $runner,
        HookableInterface $hooksFacade
    ) {
        parent::__construct($store, $logger, $runner);

        $this->hooksFacade = $hooksFacade;

        $this->table_header = __('Future Actions', 'post-expirator');

        unset($this->columns['group']);
        $this->columns['hook'] = __('Action', 'post-expirator');

        $this->hooksFacade->addAction('admin_enqueue_scripts', [$this, 'enqueueScripts']);

        $this->row_actions = array(
            'hook' => array(
                'run' => array(
                    'name' => __('Run', 'post-expirator'),
                    'desc' => __('Process the action now', 'post-expirator'),
                ),
                'cancel' => array(
                    'name' => __('Cancel', 'post-expirator'),
                    'desc' => __(
                        'Cancel the action. This will prevent the action from running in the future',
                        'post-expirator'
                    ),
                    'class' => 'cancel trash',
                ),
            ),
        );

        self::$time_periods = array(
            array(
                'seconds' => YEAR_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s year', '%s years', 'action-scheduler' ),
            ),
            array(
                'seconds' => MONTH_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s month', '%s months', 'action-scheduler' ),
            ),
            array(
                'seconds' => WEEK_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s week', '%s weeks', 'action-scheduler' ),
            ),
            array(
                'seconds' => DAY_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s day', '%s days', 'action-scheduler' ),
            ),
            array(
                'seconds' => HOUR_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s hour', '%s hours', 'action-scheduler' ),
            ),
            array(
                'seconds' => MINUTE_IN_SECONDS,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s minute', '%s minutes', 'action-scheduler' ),
            ),
            array(
                'seconds' => 1,
                /* translators: %s: amount of time */
                'names'   => _n_noop( '%s second', '%s seconds', 'action-scheduler' ),
            ),
        );

    }

    public function enqueueScripts()
    {
        wp_enqueue_script('jquery-ui-dialog');
        wp_enqueue_script(
            'publishpress-future-future-actions',
            Container::getInstance()->get(ServicesAbstract::BASE_URL) . '/assets/js/future-actions.js',
            ['jquery', 'jquery-ui-dialog'],
            PUBLISHPRESS_FUTURE_VERSION,
            true
        );
        wp_localize_script(
            'publishpress-future-future-actions',
            'publishpressFutureActionsConfig',
            [
                'dialogTitle' => esc_js(__('Action Logs', 'post-expirator')),
            ]
        );

        wp_enqueue_style('wp-jquery-ui-dialog');
    }

    protected function get_request_order()
    {
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $order = isset($_GET['order']) ? strtolower(
            sanitize_text_field(wp_unslash($_GET['order']))
        ) : '';

        if (empty($order)) {
            $order = 'desc';
        }

        return 'desc' === $order ? 'DESC' : 'ASC';
        // phpcs:enable WordPress.Security.NonceVerification.Recommended
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

        return '<span class="' . esc_attr($iconClass) . '"></span> ' . esc_html($row['status']);
    }

    public function column_hook(array $row)
    {
        $columnHtml = '<span title="' . esc_attr($row['hook']) . '">';
        if ($row['hook'] === HooksAbstract::ACTION_RUN_WORKFLOW && isset($row['args']['workflow']) && $row['args']['workflow'] === 'expire') {
            $columnHtml .= $this->render_expiration_hook_action($row);
        } else {
            $columnHtml .= esc_html(
                $this->hooksFacade->applyFilters(
                    HooksAbstract::FILTER_ACTION_SCHEDULER_LIST_COLUMN_HOOK,
                    $row['hook'] . " [{$row['ID']}]",
                    $row
                )
            );
        }
        $columnHtml .= '</span>';

        $columnHtml .= $this->maybe_render_actions($row, 'hook');

        return $columnHtml;
    }

    private function render_expiration_hook_action(array $row)
    {
        $container = Container::getInstance();
        $argsModelFactory = $container->get(ServicesAbstract::ACTION_ARGS_MODEL_FACTORY);

        $argsModel = $argsModelFactory();
        $argsModel->loadByActionId($row['ID']);

        return esc_html($argsModel->getActionLabel());
    }

    public function column_args(array $row)
    {
        if (empty($row['args'])) {
            return apply_filters('action_scheduler_list_table_column_args', '', $row);
        }

        $columnHtml = '';
        if ($row['hook'] === HooksAbstract::ACTION_RUN_WORKFLOW && isset($row['args']['workflow']) && $row['args']['workflow'] === 'expire') {
            $columnHtml = $this->render_expiration_hook_args($row);
        } else {
            $columnHtml = '<ul>';
            foreach ($row['args'] as $key => $value) {
                $columnHtml .= sprintf(
                    '<li><code>%s => %s</code></li>',
                    esc_html(var_export($key, true)), // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_var_export
                    // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_var_export
                    esc_html(
                        var_export($value, true) // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_var_export
                    )
                );
            }

            $columnHtml .= '</ul>';
        }

        return apply_filters('action_scheduler_list_table_column_args', $columnHtml, $row);
    }

    private function render_expiration_hook_args(array $row)
    {
        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($row['args']['postId']);

        $columnHtml = sprintf(
            esc_html__('%s: [%d] %s%s%s', 'post-expirator'),
            esc_html($postModel->getPostTypeSingularLabel()),
            $postModel->getPostId(),
            '<a href="' . esc_url($postModel->getPostEditLink()) . '">',
            $postModel->getTitle(),
            '</a>'
        );

        $taxonomyActions = [
            ExpirationActionsAbstract::POST_CATEGORY_SET,
            ExpirationActionsAbstract::POST_CATEGORY_REMOVE,
            ExpirationActionsAbstract::POST_CATEGORY_ADD
        ];

        $argsModelFactory = $container->get(ServicesAbstract::ACTION_ARGS_MODEL_FACTORY);

        $argsModel = $argsModelFactory();
        $argsModel->loadByActionId($row['ID']);

        if (in_array($argsModel->getAction(), $taxonomyActions)) {
            $columnHtml .= sprintf(
                '<br />' . esc_html__('Terms: %s', 'post-expirator'),
                implode(', ', $argsModel->getTaxonomyTermsNames())
            );
        }

        return $columnHtml;
    }

    /**
     * Prints the logs entries inline. We do so to avoid loading Javascript and other hacks to show it in a modal.
     *
     * @param array $row Action array.
     * @return string
     */
    public function column_log_entries(array $row)
    {
        $timezone = new \DateTimeZone('UTC');

        $userLogFormat = get_user_meta(get_current_user_id(), 'publishpressfuture_actions_log_format', true);

        $html = '';

        if (! in_array((string)$userLogFormat, ['list', 'popup'])) {
            $userLogFormat = 'popup';
        }

        if ($userLogFormat === 'list') {
            $html = '<ol>';

            foreach ($row['log_entries'] as $logEntry) {
                $html .= $this->get_log_entry_html($logEntry, $timezone);
            }

            $html .= '</ol>';
        }

        if ($userLogFormat === 'popup') {
            $html = '<a href="javascript:void(0);" class="publishpres-future-view-log" data-id="' . $row['ID'] . '">' . esc_html__(
                    'View log',
                    'post-expirator'
                ) . '</a>';
            $html .= '<div class="publishpress-future-log-entries-popup publishpress-future-log-' . $row['ID'] . '" style="display: none;">';
            $html .= '<div>';

            $html .= '<table>';
            $html .= '<tbody>';

            $html .= '<tr>';
            $html .= '<td>' . esc_html__('Action: ', 'post-expirator') . '</td><td>' . $this->column_hook(
                    $row
                ) . '</td>';
            $html .= '</tr>';

            $html .= '<tr>';
            $html .= '<td>' . esc_html__('Status: ', 'post-expirator') . '</td><td>' . $this->column_status(
                    $row
                ) . '</td>';
            $html .= '</tr>';

            $html .= '<tr>';
            $html .= '<td>' . esc_html__('Arguments: ', 'post-expirator') . '</td><td>' . $this->column_args(
                    $row
                ) . '</td>';
            $html .= '</tr>';

            $html .= '<tr>';
            $html .= '<td>' . esc_html__('Scheduled date: ', 'post-expirator') . '</td><td>' . $this->column_schedule(
                    $row
                ) . '</td>';
            $html .= '</tr>';

            $html .= '</tbody>';
            $html .= '</table>';


            $html .= '<br />';

            $html .= '<table class="wp-list-table widefat striped">';
            $html .= '<thead>';
            $html .= '<tr>';
            $html .= '<th>' . esc_html__('Date', 'post-expirator') . '</th>';
            $html .= '<th>' . esc_html__('Message', 'post-expirator') . '</th>';
            $html .= '</tr>';
            $html .= '</thead>';
            $html .= '<tbody>';

            foreach ($row['log_entries'] as $logEntry) {
                $date = $logEntry->get_date();
                $date->setTimezone($timezone);

                $html .= '<tr>';
                $html .= '<td>' . esc_html($date->format('Y-m-d H:i:s O')) . '</td>';
                $html .= '<td>' . esc_html(ucfirst($logEntry->get_message())) . '</td>';
                $html .= '</tr>';
            }

            $html .= '</tbody>';
            $html .= '</table>';
            $html .= '</div>';
        }

        return $html;
    }

    /**
     * Get the scheduled date in a human friendly format.
     *
     * @param \ActionScheduler_Schedule $schedule
     * @return string
     */
    protected function get_schedule_display_string(\ActionScheduler_Schedule $schedule)
    {
        $schedule_display_string = '';

        if (is_a($schedule, 'ActionScheduler_NullSchedule')) {
            return __('Async', 'post-expirator');
        }

        if (! method_exists($schedule, 'get_date') || ! $schedule->get_date()) {
            return '0000-00-00 00:00:00';
        }

        $next_timestamp = $schedule->get_date()->getTimestamp();

        $gmt_schedule_display_string = $schedule->get_date()->format('Y-m-d H:i:s O');
        $schedule_display_string .= wp_date('Y-m-d H:i:s O', $next_timestamp);
        $schedule_display_string .= '<br/>';

        if (gmdate('U') > $next_timestamp) {
            /* translators: %s: date interval */
            $schedule_display_string .= sprintf(
                __(' (%s ago)', 'action-scheduler'),
                self::human_interval(gmdate('U') - $next_timestamp)
            );
        } else {
            /* translators: %s: date interval */
            $schedule_display_string .= sprintf(
                __(' (%s)', 'action-scheduler'),
                self::human_interval($next_timestamp - gmdate('U'))
            );
        }

        return '<span title="' . esc_attr($gmt_schedule_display_string) . '">' . $schedule_display_string . '</span>';
    }

    /**
     * Convert an interval of seconds into a two part human friendly string.
     *
     * The WordPress human_time_diff() function only calculates the time difference to one degree, meaning
     * even if an action is 1 day and 11 hours away, it will display "1 day". This function goes one step
     * further to display two degrees of accuracy.
     *
     * Inspired by the Crontrol::interval() function by Edward Dale: https://wordpress.org/plugins/wp-crontrol/
     *
     * @param int $interval A interval in seconds.
     * @param int $periods_to_include Depth of time periods to include, e.g. for an interval of 70, and $periods_to_include of 2, both minutes and seconds would be included. With a value of 1, only minutes would be included.
     * @return string A human friendly string representation of the interval.
     */
    private static function human_interval($interval, $periods_to_include = 2)
    {
        if ($interval <= 0) {
            return __('Now!', 'action-scheduler');
        }

        $output = '';

        for (
            $time_period_index = 0, $periods_included = 0, $seconds_remaining = $interval; $time_period_index < count(
            self::$time_periods
        ) && $seconds_remaining > 0 && $periods_included < $periods_to_include; $time_period_index++
        ) {
            $periods_in_interval = floor($seconds_remaining / self::$time_periods[$time_period_index]['seconds']);

            if ($periods_in_interval > 0) {
                if (! empty($output)) {
                    $output .= ' ';
                }
                $output .= sprintf(
                    _n(
                        self::$time_periods[$time_period_index]['names'][0],
                        self::$time_periods[$time_period_index]['names'][1],
                        $periods_in_interval,
                        'action-scheduler'
                    ),
                    $periods_in_interval
                );
                $seconds_remaining -= $periods_in_interval * self::$time_periods[$time_period_index]['seconds'];
                $periods_included++;
            }
        }

        return $output;
    }
}
