<?php

use PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Framework\Logger\LoggerInterface;

$container = Container::getInstance();
$hooks = $container->get(ServicesAbstract::HOOKS);

defined('ABSPATH') or die('Direct access not allowed.');

echo '<p>' . esc_html__(
    'Below is a dump of the debugging table, this should be useful for troubleshooting.',
    'post-expirator'
) . '</p>';

$showSideBar = $hooks->applyFilters(
    HooksAbstract::FILTER_SHOW_PRO_BANNER,
    ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
);

echo '<div class="pp-columns-wrapper' . ($showSideBar ? ' pp-enable-sidebar' : '') . '">';
echo '<div class="pp-column-left">';

/**
 * @var LoggerInterface $logger
 */
$logger = Container::getInstance()->get(ServicesAbstract::LOGGER);
$results = $logger->fetchLatest(500);
$totalLogs = $logger->getTotalLogs();
$logSizeInBytes = $logger->getLogSizeInBytes();

if (empty($results)) {
    echo '<p>' . esc_html__('Debugging table is currently empty.', 'post-expirator') . '</p>';
}

if (! empty($results)) {

    echo '<div class="pp-debug-log">';
    echo '<textarea readonly>';
    foreach ($results as $result) {
        printf("%s: %s\n", $result['timestamp'], esc_html($result['message']));
    }
    echo '</textarea>';

    $totalDisplayedLogs = count($results);

    if ($totalLogs > $totalDisplayedLogs) {
        echo '<p id="debug-log-length">' . sprintf(
        // translators: %s is the number of results in the debug log. %s is the size of the log in the most appropriate unit.
        esc_html__('Showing the latest %d of %d results. The approximate size of the log is %s.', 'post-expirator'),
        $totalDisplayedLogs,
        $totalLogs,
            PostExpirator_Util::formatBytes($logSizeInBytes)
        ) . '</p>';
    } else {
        echo '<p id="debug-log-length">' . sprintf(
            // translators: %s is the size of the log in the most appropriate unit.
            esc_html__('Showing all %d results. The approximate size of the log is %s.', 'post-expirator'),
            $totalLogs,
            PostExpirator_Util::formatBytes($logSizeInBytes)
        ) . '</p>';
    }

    echo '<div class="pp-debug-log-actions">';

    $nonce = wp_create_nonce('publishpress_future_download_log');

    echo '<button id="copy-debug-log" class="button">' . esc_html__('Copy Debug Log', 'post-expirator') . '</button>';

    echo '<a href="' . esc_url(add_query_arg([
        'action' => 'publishpress_future_debug_log',
        'nonce' => $nonce,
    ], admin_url('admin.php'))) . '" class="button">'
        . esc_html__('Download Entire Log', 'post-expirator') . '</a>';

    echo '</div>';

    // Add JavaScript to handle copying
    ?>
    <script>
    document.getElementById('copy-debug-log').addEventListener('click', function() {
        const debugLog = document.querySelector('.pp-debug-log textarea');
        debugLog.select();
        document.execCommand('copy');
        alert('<?php echo esc_js(__('Debug log copied to clipboard!', 'post-expirator')); ?>');
    });
    </script>
    <?php

    echo '</div>';

    // Add JavaScript to auto-scroll textarea to the end
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const debugLog = document.querySelector('.pp-debug-log textarea');
        debugLog.scrollTop = debugLog.scrollHeight;
    });
    </script>
    <?php
}

echo '</div>';

if ($showSideBar) {
    include __DIR__ . '/ad-banner-right-sidebar.php';
}
echo '</div>';
