<?php

use PublishPressFuture\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

print '<p>' . esc_html__(
        'Below is a dump of the debugging table, this should be useful for troubleshooting.',
        'post-expirator'
    ) . '</p>';

$showSideBar = apply_filters(
    HooksAbstract::FILTER_SHOW_PRO_BANNER,
    ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
);

print '<div class="pp-columns-wrapper' . ($showSideBar ? ' pp-enable-sidebar' : '') . '">';
print '<div class="pp-column-left">';

$debug = new PostExpiratorDebug();
$results = $debug->getTable();

if (empty($results)) {
    print '<p>' . esc_html__('Debugging table is currently empty.', 'post-expirator') . '</p>';

    return;
}
print '<table class="form-table"><tbody><tr><td>';
print '<table class="post-expirator-debug striped wp-list-table widefat fixed table-view-list">';
print '<thead>';
print '<tr><th class="post-expirator-timestamp">' . esc_html__('Timestamp', 'post-expirator') . '</th>';
print '<th>' . esc_html__('Message', 'post-expirator') . '</th></tr>';
print '</thead>';
print '<tbody>';
foreach ($results as $result) {
    print '<tr><td>' . esc_html($result->timestamp) . '</td>';
    print '<td>' . esc_html($result->message) . '</td></tr>';
}
print '</tbody>';
print '</table>';
print '</td></tr></tbody></table>';

print '</div>';

if ($showSideBar) {
    include __DIR__ . '/ad-banner-right-sidebar.php';
}
print '</div>';
