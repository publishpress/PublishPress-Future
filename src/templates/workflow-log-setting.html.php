<?php
defined('ABSPATH') or die('Direct access not allowed.');

$nonce = wp_create_nonce('workflow-logs-settings');
?>
<tr>
    <th scope="row"><label for="postexpirator-log"><?php
            esc_html_e('Expiration Log', 'publishpress-future-pro'); ?></label></th>
    <td>
        <?php if ($enabled) : ?>
            <i class="dashicons dashicons-yes-alt pe-status pe-status-enabled"></i> <span><?php
                esc_html_e('Enabled', 'publishpress-future-pro'); ?></span>
            <?php
            $disableUrlArgs = [
                'action' => 'disable-workflow-logs',
                'nonce' => $nonce,
            ];

            echo '<a href="' . esc_url(add_query_arg($disableUrlArgs)) . '" class="button">'
                . esc_html__(
                    'Disable Log',
                    'publishpress-future-pro'
                ) . '</a>'; ?>
            <?php
            echo '<a href="' . esc_url(
                    admin_url(
                        'admin.php?page=publishpress-future-log'
                    )
                ) . '">' . esc_html__('View Logs', 'publishpress-future-pro') . '</a>'; ?>
        <?php else : ?>
            <i class="dashicons dashicons-no-alt pe-status pe-status-disabled"></i> <span><?php
                esc_html_e('Disabled', 'publishpress-future-pro'); ?></span>
            <?php
            $enableUrlArgs = [
                'action' => 'enable-workflow-logs',
                'nonce' => $nonce,
            ];

            echo '<a href="' . esc_url(add_query_arg($enableUrlArgs)) . '" class="button">'
                . esc_html__(
                    'Enable Log',
                    'publishpress-future-pro'
                ) . '</a>'; ?>
        <?php endif; ?>
    </td>
</tr>
