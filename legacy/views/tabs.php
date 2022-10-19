<?php

use \PublishPressFuture\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
// phpcs:ignore WordPress.Security.NonceVerification.Recommended
$current_tab = empty($_GET['tab']) ? 'general' : sanitize_title(wp_unslash($_GET['tab']));

$debugIsEnabled = apply_filters(HooksAbstract::FILTER_DEBUG_ENABLED, false);
?>

<div class="wrap">
    <h2><?php
        esc_html_e('PublishPress Future', 'post-expirator'); ?></h2>
    <div id="pe-settings-tabs">
        <nav class="nav-tab-wrapper postexpirator-nav-tab-wrapper">
            <a href="<?php
            echo esc_url(admin_url('admin.php?page=publishpress-future&tab=general')); ?>"
               class="pe-tab nav-tab <?php
               echo ($current_tab === 'general' ? 'nav-tab-active' : ''); ?>"><?php
                esc_html_e('Defaults', 'post-expirator'); ?></a>
            <a href="<?php
            echo esc_url(admin_url('admin.php?page=publishpress-future&tab=display')); ?>"
               class="pe-tab nav-tab <?php
               echo ($current_tab === 'display' ? 'nav-tab-active' : ''); ?>"><?php
                esc_html_e('Display', 'post-expirator'); ?></a>
            <a href="<?php
            echo esc_url(admin_url('admin.php?page=publishpress-future&tab=defaults')); ?>"
               class="pe-tab nav-tab <?php
               echo ($current_tab === 'defaults' ? 'nav-tab-active' : ''); ?>"><?php
                esc_html_e('Post Types', 'post-expirator'); ?></a>
            <a href="<?php
            echo esc_url(admin_url('admin.php?page=publishpress-future&tab=advanced')); ?>"
               class="pe-tab nav-tab <?php
               echo ($current_tab === 'advanced' ? 'nav-tab-active' : ''); ?>"><?php
                esc_html_e('Advanced', 'post-expirator'); ?></a>
            <a href="<?php
            echo esc_url(admin_url('admin.php?page=publishpress-future&tab=diagnostics')); ?>"
               class="pe-tab nav-tab <?php
               echo ($current_tab === 'diagnostics' ? 'nav-tab-active' : ''); ?>"><?php
                esc_html_e('Diagnostics', 'post-expirator'); ?></a>
            <?php
            if ($debugIsEnabled) { ?>
                <a href="<?php
                echo esc_url(admin_url('admin.php?page=publishpress-future&tab=viewdebug')); ?>"
                   class="pe-tab nav-tab <?php
                   echo ($current_tab === 'viewdebug' ? 'nav-tab-active' : ''); ?>"><?php
                    esc_html_e('View Debug Logs', 'post-expirator'); ?></a>
                <?php
            } ?>
        </nav>

        <?php
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
        echo $html;
        ?>

    </div>
</div>
