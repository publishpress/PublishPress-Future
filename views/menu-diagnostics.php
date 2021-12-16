<?php
defined('ABSPATH') or die('Direct access not allowed.');
?>

<form method="post" id="postExpiratorMenuUpgrade">
    <?php
    wp_nonce_field('postexpirator_menu_diagnostics', '_postExpiratorMenuDiagnostics_nonce'); ?>
    <h3><?php
        esc_html_e('Advanced Diagnostics', 'post-expirator'); ?></h3>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="postexpirator-log"><?php
                    esc_html_e('Debug Logging', 'post-expirator'); ?></label></th>
            <td>
                <?php
                if (defined('POSTEXPIRATOR_DEBUG') && POSTEXPIRATOR_DEBUG) : ?>
                    <i class="dashicons dashicons-yes-alt pe-status pe-status-enabled"></i> <span><?php
                        esc_html_e('Enabled', 'post-expirator'); ?></span>
                    <?php
                    echo '<input type="submit" class="button" name="debugging-disable" id="debugging-disable" value=" ' . esc_html__(
                            'Disable Debugging',
                            'post-expirator'
                        ) . '" />'; ?>
                    <?php
                    echo '<a href="' . esc_url(admin_url(
                            'options-general.php?page=post-expirator.php&tab=viewdebug'
                        )) . '">' . esc_html__('View Debug Logs', 'post-expirator') . '</a>'; ?>
                <?php
                else: ?>
                    <i class="dashicons dashicons-no-alt pe-status pe-status-disabled"></i> <span><?php
                        esc_html_e('Disabled', 'post-expirator'); ?></span>
                    <?php
                    echo '<input type="submit" class="button" name="debugging-enable" id="debugging-enable" value=" ' . esc_html__(
                            'Enable Debugging',
                            'post-expirator'
                        ) . '" />'; ?>
                <?php
                endif;
                ?>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php
                esc_html_e('Purge Debug Log', 'post-expirator'); ?></th>
            <td>
                <input type="submit" class="button" name="purge-debug" id="purge-debug" value="<?php
                esc_html_e('Purge Debug Log', 'post-expirator'); ?>"/>
            </td>
        </tr>
        <tr>
            <th scope="row"><?php
                esc_html_e('WP-Cron Status', 'post-expirator'); ?></th>
            <td>
                <?php
                if (PostExpirator_CronFacade::is_cron_enabled()) : ?>
                    <i class="dashicons dashicons-yes pe-status pe-status-enabled"></i> <span><?php
                        esc_html_e('Enabled', 'post-expirator'); ?></span>
                <?php
                else: ?>
                    <i class="dashicons dashicons-no pe-status pe-status-disabled"></i> <span><?php
                        esc_html_e('Disabled', 'post-expirator'); ?></span>
                <?php
                endif;
                ?>
            </td>
        </tr/>
        <tr>
            <th scope="row"><label for="cron-schedule"><?php
                    esc_html_e('Current Cron Schedule', 'post-expirator'); ?></label></th>
            <td>
                <?php
                $cron = PostExpirator_CronFacade::get_plugin_cron_events();

                if (empty($cron)) {
                    ?>
                    <p><?php
                        esc_html_e(
                            'No cron events found for the plugin.',
                            'post-expirator'
                        ); ?></p>
                    <?php
                } else {
                    ?>
                    <p><?php
                        esc_html_e(
                            'The below table will show all currently scheduled cron events for the pluginwith the next run time.',
                            'post-expirator'
                        ); ?></p>

                    <div>
                        <table class="striped">
                            <tr>
                                <th><?php
                                    esc_html_e('Date', 'post-expirator'); ?></th>
                                <th><?php
                                    esc_html_e('Event', 'post-expirator'); ?></th>
                                <th><?php
                                    esc_html_e('Arguments / Schedule', 'post-expirator'); ?></th>
                                <th><?php
                                    esc_html_e('Post', 'post-expirator'); ?></th>
                            </tr>
                            <?php

                            foreach ($cron as $time => $value) {
                                foreach ($value as $eventkey => $eventvalue) {
                                    echo '<tr class="pe-event">';
                                    echo '<td>' . esc_html(PostExpirator_Util::get_wp_date('r', $time)) . '</td>';
                                    echo '<td>' . esc_html($eventkey) . '</td>';
                                    $arrkey = array_keys($eventvalue);
                                    $firstArgsUid = null;
                                    echo '<td>';
                                    foreach ($arrkey as $eventguid) {
                                        if (is_null($firstArgsUid)) {
                                            $firstArgsUid = $eventguid;
                                        }
                                        if (empty($eventvalue[$eventguid]['args'])) {
                                            echo '<div>' . esc_html__('No Arguments', 'post-expirator') . '</div>';
                                        } else {
                                            echo '<div>';
                                            foreach ($eventvalue[$eventguid]['args'] as $key => $value) {
                                                echo esc_html("$key => $value") . '<br>';
                                            }
                                            echo '</div>';
                                        }
                                    }
                                    echo '&nbsp;/&nbsp;';
                                    if (empty($eventvalue[$eventguid]['schedule'])) {
                                        echo esc_html__('Single Event', 'post-expirator');
                                    } else {
                                        echo esc_html($eventvalue[$eventguid]['schedule']) . ' (' . esc_html($eventvalue[$eventguid]['interval']) . ')';
                                    }
                                    echo '</td>';

                                    echo '<td>';
                                    if (
                                        isset($eventvalue[$firstArgsUid])
                                        && isset($eventvalue[$firstArgsUid]['args'])
                                        && isset($eventvalue[$firstArgsUid]['args'][0])
                                        && ! empty($eventvalue[$firstArgsUid]['args'][0])
                                    ) {
                                        $post = get_post((int)$eventvalue[$firstArgsUid]['args'][0]);

                                        if (! empty($post) && ! is_wp_error($post) && is_object($post)) {
                                            echo esc_html("{$post->ID}: {$post->post_title} ({$post->post_status})");
                                        }
                                    }
                                    echo '</td>';
                                    echo '</tr>';
                                }
                            }
                            ?>
                        </table>
                    </div>
                    <?php
                }
                ?>
            </td>
        </tr>
    </table>
</form><?php
