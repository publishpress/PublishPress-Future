<?php

$current_tab = empty($_GET['tab']) ? 'general' : sanitize_title(wp_unslash($_GET['tab']));
?>

<div class="wrap">
    <h2><?php
        __('Post Expirator Options', 'post-expirator'); ?></h2>
    <div id="pe-settings-tabs">
        <nav class="nav-tab-wrapper postexpirator-nav-tab-wrapper">
            <a href="<?php
            echo admin_url('options-general.php?page=post-expirator.php&tab=general'); ?>"
               class="pe-tab nav-tab <?php
               echo($current_tab === 'general' ? 'nav-tab-active' : ''); ?>"><?php
                _e('General Settings', 'post-expirator'); ?></a>
            <a href="<?php
            echo admin_url('options-general.php?page=post-expirator.php&tab=defaults'); ?>"
               class="pe-tab nav-tab <?php
               echo($current_tab === 'defaults' ? 'nav-tab-active' : ''); ?>"><?php
                _e('Post Types', 'post-expirator'); ?></a>
            <a href="<?php
            echo admin_url('options-general.php?page=post-expirator.php&tab=diagnostics'); ?>"
               class="pe-tab nav-tab <?php
               echo($current_tab === 'diagnostics' ? 'nav-tab-active' : ''); ?>"><?php
                _e('Diagnostics', 'post-expirator'); ?></a>
            <?php
            if (POSTEXPIRATOR_DEBUG) { ?>
                <a href="<?php
                echo admin_url('options-general.php?page=post-expirator.php&tab=viewdebug'); ?>"
                   class="pe-tab nav-tab <?php
                   echo($current_tab === 'viewdebug' ? 'nav-tab-active' : ''); ?>"><?php
                    _e('View Debug Logs', 'post-expirator'); ?></a>
                <?php
            } ?>
        </nav>

        <?php
        echo $html; ?>

    </div>
</div>
