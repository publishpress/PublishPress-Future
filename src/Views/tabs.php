<?php

use \PublishPressFuture\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
// phpcs:ignore WordPress.Security.NonceVerification.Recommended
$current_tab = empty($_GET['tab']) ? 'general' : sanitize_title(wp_unslash($_GET['tab']));

$debugIsEnabled = apply_filters(HooksAbstract::FILTER_DEBUG_ENABLED, false);

$tabs = [
    [
        'title' => __('Defaults', 'publishpress'),
        'slug'  => 'general',
        'link' => admin_url('admin.php?page=publishpress-future&tab=general'),
    ],
    [
        'title' => __('Display', 'publishpress'),
        'slug'  => 'display',
        'link' => admin_url('admin.php?page=publishpress-future&tab=display'),
    ],
    [
        'title' => __('Post Types', 'publishpress'),
        'slug'  => 'defaults',
        'link' => admin_url('admin.php?page=publishpress-future&tab=defaults'),
    ],
    [
        'title' => __('Advanced', 'publishpress'),
        'slug'  => 'advanced',
        'link' => admin_url('admin.php?page=publishpress-future&tab=advanced'),
    ],
    [
        'title' => __('Diagnostics', 'publishpress'),
        'slug'  => 'diagnostics',
        'link' => admin_url('admin.php?page=publishpress-future&tab=diagnostics'),
    ],
];

if ($debugIsEnabled) {
    $tabs[] = [
        'title' => __('Debug', 'publishpress'),
        'slug'  => 'viewdebug',
        'link' => admin_url('admin.php?page=publishpress-future&tab=viewdebug'),
    ];
}

$tabs = apply_filters(HooksAbstract::FILTER_SETTINGS_TABS, $tabs);

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

            <?php do_action(HooksAbstract::ACTION_SETTINGS_TABS); ?>
        </nav>

        <?php
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $html;
        ?>

    </div>
</div>
