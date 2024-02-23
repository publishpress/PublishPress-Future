<?php

use \PublishPress\Future\Modules\Settings\HooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

$container = Container::getInstance();
$hooks = $container->get(ServicesAbstract::HOOKS);

defined('ABSPATH') or die('Direct access not allowed.');

// phpcs:ignore WordPress.Security.NonceVerification.Recommended
$current_tab = empty($_GET['tab']) ? 'defaults' : sanitize_title(wp_unslash($_GET['tab']));

$debugIsEnabled = $hooks->applyFilters(HooksAbstract::FILTER_DEBUG_ENABLED, false);
$baseLink = 'admin.php?page=publishpress-future&tab=';

$tabs = [
    [
        'title' => __('Post Types', 'post-expirator'),
        'slug'  => 'defaults',
        'link' => admin_url($baseLink . 'defaults'),
    ],
    [
        'title' => __('General', 'post-expirator'),
        'slug'  => 'general',
        'link' => admin_url($baseLink . 'general'),
    ],
    [
        'title' => __('Display', 'post-expirator'),
        'slug'  => 'display',
        'link' => admin_url($baseLink . 'display'),
    ],
    [
        'title' => __('Advanced', 'post-expirator'),
        'slug'  => 'advanced',
        'link' => admin_url($baseLink . 'advanced'),
    ],
    [
        'title' => __('Diagnostics and Tools', 'post-expirator'),
        'slug'  => 'diagnostics',
        'link' => admin_url($baseLink . 'diagnostics'),
    ],
];

if ($debugIsEnabled) {
    $tabs[] = [
        'title' => __('Debug', 'post-expirator'),
        'slug'  => 'viewdebug',
        'link' => admin_url('admin.php?page=publishpress-future&tab=viewdebug'),
    ];
}

$tabs = $hooks->applyFilters(HooksAbstract::FILTER_SETTINGS_TABS, $tabs);
?>

<div class="wrap">
    <h2><?php
        esc_html_e('PublishPress Future', 'post-expirator'); ?></h2>
    <div id="pe-settings-tabs">
        <nav class="nav-tab-wrapper postexpirator-nav-tab-wrapper" id="postexpirator-nav">
            <?php foreach ($tabs as $tab) : ?>
                <a href="<?php echo esc_url($tab['link']); ?>"
                   class="pe-tab nav-tab <?php
                   echo ($current_tab === $tab['slug'] ? 'nav-tab-active' : ''); ?>"
                >
                    <?php echo esc_html($tab['title']); ?>
                </a>
            <?php endforeach; ?>
        </nav>

        <?php
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $html;
        ?>

    </div>
</div>
