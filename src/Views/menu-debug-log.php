<?php

use PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

$container = Container::getInstance();
$hooks = $container->get(ServicesAbstract::HOOKS);

defined('ABSPATH') or die('Direct access not allowed.');

print '<p>' . esc_html__(
    'Below is a dump of the debugging table, this should be useful for troubleshooting.',
    'post-expirator'
) . '</p>';

$showSideBar = $hooks->applyFilters(
    HooksAbstract::FILTER_SHOW_PRO_BANNER,
    ! defined('PUBLISHPRESS_FUTURE_LOADED_BY_PRO')
);

print '<div class="pp-columns-wrapper' . ($showSideBar ? ' pp-enable-sidebar' : '') . '">';
print '<div class="pp-column-left">';

$debug = Container::getInstance()->get(ServicesAbstract::DEBUG);
$results = $debug->fetchAll();

if (empty($results)) {
    print '<p>' . esc_html__('Debugging table is currently empty.', 'post-expirator') . '</p>';
}

if (! empty($results)) {

    // Add copy button
    print '<button id="copy-debug-log" class="button">' . esc_html__('Copy Debug Log', 'post-expirator') . '</button>';
    print '<br><br>';

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

    print '<div class="pp-debug-log">';
    print '<textarea readonly>';
    foreach ($results as $result) {
        printf("%s: %s\n", $result['timestamp'], esc_html($result['message']));
    }
    print '</textarea>';

    $totalOfResults = count($results);

    print '<p id="debug-log-length">' . sprintf(
        // translators: %s is the number of results in the debug log. %s is the size of the log in KB.
        esc_html__('Debug log contains %s results. The approximate size of the log is %s KB.', 'post-expirator'),
        $totalOfResults,
        '###'
    ) . '</p>';

    print '</div>';

    // Add JavaScript to auto-scroll textarea to the end
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const debugLog = document.querySelector('.pp-debug-log textarea');
        debugLog.scrollTop = debugLog.scrollHeight;

        // Measure the size in bytes of the debug log
        const debugLogSize = debugLog.value.length / 1024;
        document.getElementById('debug-log-length').textContent =
            document.getElementById('debug-log-length').textContent.replace('###', debugLogSize.toFixed(2));
    });
    </script>
    <?php
}

print '</div>';

if ($showSideBar) {
    include __DIR__ . '/ad-banner-right-sidebar.php';
}
print '</div>';
