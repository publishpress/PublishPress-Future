<?php

defined('ABSPATH') or die('Direct access not allowed.');

?>
<form method="post">
    <?php
    wp_nonce_field('postexpirator_menu_license', '_future_license_nonce'); ?>

    <h3><?php
        esc_html_e('License', 'publishpress-future-pro'); ?></h3>

    <table class="form-table">
        <tr valign="top">
            <th scope="row">
                <label for="expired-default-date-format"><?php
                    esc_html_e('License', 'publishpress-future-pro'); ?></label>
            </th>
            <td>
                <?php
                $value = $this->settingsModel->getLicenseKey();
                $status = $this->settingsModel->getLicenseStatus();
                $error = '';

                if (empty($status) || empty($value)) {
                    $status = 'invalid';
                }

                if (! in_array($status, array('valid', 'invalid'))) {
                    $error = $status;
                    $status = 'invalid';
                }

                if ($status === 'valid') {
                    $statusLabel = __('Activated', 'publishpress-future-pro');
                } else {
                    $statusLabel = __('Inactive', 'publishpress-future-pro');

                    if (! empty($error)) {
                        $statusLabel .= ' - ' . $error;
                    }
                }

                $id = 'future_pro_license_key';

                echo '<label for="' . esc_attr($id) . '" id="' . esc_attr($id) . '">';
                echo '<input type="text" value="' . esc_attr($value) . '" id="' . esc_attr(
                    $id
                ) . '" name="license_key" />';
                echo '<div class="ppfuturepro_license_status ppfuturepro_license_status_' . esc_attr(
                    $status
                ) . '">' . esc_html__('Status: ', 'publishpress-future-pro') .
                    '<span>' . esc_html($statusLabel) . '</span></div>';
                echo '<p class="description">' . esc_html__(
                    'Enter the license key for being able to update the plugin.',
                    'publishpress-future-pro'
                ) . '</p>';
                echo '</label>';
                ?>
            </td>
        </tr>
    </table>

    <p class="submit">
        <input type="submit" name="futureproSave" class="button-primary"
               value="<?php
                esc_attr_e('Save Changes', 'publishpress-future-pro'); ?>"/>
    </p>
</form>
