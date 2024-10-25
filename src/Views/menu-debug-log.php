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

$debug = new PostExpiratorDebug();
$results = $debug->getTable();

if (empty($results)) {
    print '<p>' . esc_html__('Debugging table is currently empty.', 'post-expirator') . '</p>';

    return;
}
print '<div class="pp-debug-log">';
print '<textarea readonly>';
foreach ($results as $result) {
    printf("%s: %s\n", $result->timestamp, $result->message);
}
print '</textarea>';
print '</div>';
print '</div>';

if ($showSideBar) {
    include __DIR__ . '/ad-banner-right-sidebar.php';
}
print '</div>';
