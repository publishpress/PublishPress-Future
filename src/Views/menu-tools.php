<?php

defined('ABSPATH') or die('Direct access not allowed.');

$container = PublishPress\Future\Core\DI\Container::getInstance();
?>

    <div class="pp-columns-wrapper<?php
    echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
        <div class="pp-column-left">
            <table class="form-table">
                <tbody>
                <tr valign="top">
                    <th scope="row"><?php
                        _e('Migrate legacy future actions', 'post-expirator'); ?>
                    </th>
                    <td>
                        <?php
                        $nonce = wp_create_nonce('future-migrate-legacy-post-expirations');
                        $url = admin_url('admin.php?action=future_migrate_legacy_post_expirations&nonce=' . $nonce);
                        ?>
                        <a href="<?php echo esc_url($url); ?>" class="button">
                            <?php esc_html_e('Migrate', 'post-expirator'); ?>
                        </a>

                        <p class="description">
                            <?php esc_html_e(
                                'Migrate legacy future actions from WP Cron to the new Action Scheduler. This will run in the background and may take a while.',
                                'post-expirator'
                            ); ?>
                        </p>
                    </td>
                </tbody>
            </table>
        </div>

        <?php
        if ($showSideBar) {
            include __DIR__ . '/ad-banner-right-sidebar.php';
        }
        ?>
    </div>
<?php
