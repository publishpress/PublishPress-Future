<?php

use PublishPressFuture\Modules\Debug\HooksAbstract;
use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

$container = PublishPressFuture\Core\DI\Container::getInstance();
$debug = $container->get(\PublishPressFuture\Core\DI\ServicesAbstract::DEBUG);
?>

<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
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
                        <?php if ($debug->isEnabled()) : ?>
                            <i class="dashicons dashicons-yes-alt pe-status pe-status-enabled"></i> <span><?php
                                esc_html_e('Enabled', 'post-expirator'); ?></span>
                            <?php
                            echo '<input type="submit" class="button" name="debugging-disable" id="debugging-disable" value=" '
                                . esc_html__(
                                    'Disable Debugging',
                                    'post-expirator'
                                ) . '" />'; ?>
                            <?php
                            echo '<a href="' . esc_url(
                                admin_url(
                                    'admin.php?page=publishpress-future&tab=viewdebug'
                                )
                            ) . '">' . esc_html__('View Debug Logs', 'post-expirator') . '</a>'; ?>
                        <?php else : ?>
                            <i class="dashicons dashicons-no-alt pe-status pe-status-disabled"></i> <span><?php
                                esc_html_e('Disabled', 'post-expirator'); ?></span>
                            <?php
                            echo '<input type="submit" class="button" name="debugging-enable" id="debugging-enable" value=" '
                                . esc_html__(
                                    'Enable Debugging',
                                    'post-expirator'
                                ) . '" />'; ?>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php do_action(HooksAbstract::ACTION_AFTER_DEBUG_LOG_SETTING); ?>
                <tr>
                    <th scope="row"><?php
                        esc_html_e('Purge Debug Log', 'post-expirator'); ?></th>
                    <td>
                        <input type="submit" class="button" name="purge-debug" id="purge-debug" value="<?php
                        esc_attr_e('Purge Debug Log', 'post-expirator'); ?>"/>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><?php
                        esc_html_e('WP-Cron Status', 'post-expirator'); ?></th>
                    <td>
                        <?php if (PostExpirator_CronFacade::is_cron_enabled()) : ?>
                            <i class="dashicons dashicons-yes pe-status pe-status-enabled"></i> <span><?php
                                esc_html_e('Enabled', 'post-expirator'); ?></span>
                        <?php else : ?>
                            <i class="dashicons dashicons-no pe-status pe-status-disabled"></i> <span><?php
                                esc_html_e('Disabled', 'post-expirator'); ?></span>
                        <?php endif; ?>
                    </td>
                </tr>
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
                                // phpcs:disable Generic.Files.LineLength.TooLong
                                esc_html_e(
                                    'The below table will show all currently scheduled cron events for the plugin with the next run time.',
                                    'post-expirator'
                                );
                                // phpcs:enable
                                ?></p>

                            <div>
                                <table class="striped wp-list-table widefat fixed table-view-list">
                                    <thead>
                                        <tr>
                                            <th class="pe-date-column">
                                                <?php esc_html_e('Date', 'post-expirator'); ?>
                                            </th>
                                            <th class="pe-event-column">
                                                <?php esc_html_e('Event', 'post-expirator'); ?>
                                            </th>
                                            <th>
                                                <?php esc_html_e('Posts and expiration settings', 'post-expirator'); ?>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php
                                            $printPostEvent = function ($post) {
                                                echo esc_html("$post->ID: $post->post_title (status: $post->post_status)");
                                                $attributes = PostExpirator_Facade::get_expire_principles($post->ID);
                                                echo ': <span class="post-expiration-attributes">';
                                                // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
                                                print_r($attributes);
                                                echo '</span>';
                                            };

                                            // phpcs:disable Generic.WhiteSpace.ScopeIndent.IncorrectExact
                                            foreach ($cron as $time => $value) {
                                                foreach ($value as $eventKey => $eventValue) {
                                                    echo '<tr class="pe-event">';
                                                    echo '<td>' . esc_html(PostExpirator_Util::get_wp_date('r', $time))
                                                        . '</td>';
                                                    echo '<td>' . esc_html($eventKey) . '</td>';
                                                    $eventValueKeys = array_keys($eventValue);
                                                    echo '<td>';
                                                    foreach ($eventValueKeys as $eventGUID) {
                                                        if (false === empty($eventValue[$eventGUID]['args'])) {
                                                            echo '<div class="pe-event-post" title="' . esc_attr($eventGUID) . '">';
                                                            foreach ($eventValue[$eventGUID]['args'] as $value) {
                                                                $eventPost = get_post((int)$value);

                                                                if (
                                                                    false === empty($eventPost)
                                                                    && false === is_wp_error($eventPost)
                                                                    && is_object($eventPost)
                                                                ) {
                                                                    $printPostEvent($eventPost);
                                                                }
                                                            }
                                                            echo '</div>';
                                                        }
                                                    }
                                                    echo '</td>';
                                                    echo '</tr>';
                                                }
                                            }
                                        // phpcs:enable ?>
                                    </tbody>
                                </table>
                            </div>
                            <?php
                        }
                        ?>
                    </td>
                </tr>
            </table>
        </form>
    </div>

    <?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
    ?>
</div>
<?php
