<?php
/**
 * @return bool
 * @author PublishPress
 * @copyright Copyright (c) 2023, PublishPress
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPL v2 or later
 * @package PublishPressFuturePro
 */

namespace PublishPressFuture {

    use function add_action;
    use function esc_html__;
    use function load_plugin_textdomain;

    use const PHP_VERSION;
    use const PHP_VERSION_ID;

    const RELATIVE_PLUGIN_FILE = 'post-expirator/post-expirator.php';
    const MIN_PHP_VERSION = '7.2.5';
    const MIN_PHP_VERSION_ID = 70205;

    if (! (PHP_VERSION_ID >= MIN_PHP_VERSION_ID)) {
        load_plugin_textdomain('post-expirator', false, __DIR__ . '/../languages/');

        add_action('after_plugin_row_' . RELATIVE_PLUGIN_FILE, function ($pluginFile) {
            ?>
            <tr>
                <td>&nbsp;</td>
                <td colspan="3" class="colspanchange">
                    <div class="notice inline notice-warning notice-alt">
                        <p>
                            <span class="dashicons dashicons-warning" style="margin-right: 6px; color: #d63638;"></span>
                            <?php
                            echo esc_html__(
                                sprintf(
                                    '%s requires PHP %s or later. Please upgrade PHP to a compatible version. Your current version is %s.',
                                    'PublishPress Future',
                                    MIN_PHP_VERSION,
                                    PHP_VERSION
                                )
                            );
                            ?>
                        </p>
                    </div>
                </td>
            </tr>
            <?php
        });

        return false;
    }

    return true;
}
