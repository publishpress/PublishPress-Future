<?php

use PublishPress\Future\Core\DI\Container as DIContainer;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

// Get Option
$preserveData = (bool)get_option('expirationdatePreserveData', true);

$user_roles = wp_roles()->get_names();
$plugin_facade = PostExpirator_Facade::getInstance();
$container = DIContainer::getInstance();
$hooks = $container->get(ServicesAbstract::HOOKS);

?>
<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <form method="post" id="expirationdate_save_options">
            <?php
            wp_nonce_field('postexpirator_menu_advanced', '_postExpiratorMenuAdvanced_nonce'); ?>

            <h3><?php
                esc_html_e('Advanced Options', 'post-expirator'); ?></h3>
            <p class="description"><?php
                esc_html_e(
                    'Please do not update anything here unless you know what it entails. For advanced users only.',
                    'post-expirator'
                ); ?>
            </p>
            <table class="form-table">

                <?php $hooks->doAction(HooksAbstract::ACTION_SETTINGS_TAB_ADVANCED_BEFORE); ?>

                <tr valign="top">
                    <th scope="row"><?php
                        esc_html_e('Future Action Column Style', 'post-expirator'); ?></th>
                    <td>
                        <?php
                        $columnStyle = $container->get(ServicesAbstract::SETTINGS)->getColumnStyle();
                        ?>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-column-style"
                                id="future-action-column-style-verbose"
                                value="verbose" <?php
                            echo $columnStyle === 'verbose' ? 'checked' : ''; ?>/>
                            <label for="future-action-column-style-verbose"><?php
                                esc_html_e('Detailed', 'post-expirator'); ?></label>
                            <p class="description offset"><?php
                            esc_html_e(
                                'Displays all information in the Future Action column.',
                                'post-expirator'
                            ); ?></p>
                        </div>

                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-column-style"
                                id="future-action-column-style-simple"
                                value="simple" <?php
                            echo $columnStyle === 'simple' ? 'checked' : ''; ?>/>
                            <label for="future-action-column-style-simple"><?php
                                esc_html_e('Simplified', 'post-expirator'); ?></label>
                            <p class="description offset"><?php
                            esc_html_e(
                                'Displays only the icon and date/time.',
                                'post-expirator'
                            ); ?></p>
                        </div>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php
                        esc_html_e('Time format in the date picker', 'post-expirator'); ?></th>
                    <td>
                        <?php
                        $timeFormat = $container->get(ServicesAbstract::SETTINGS)->getTimeFormatForDatePicker();
                        ?>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-time-format"
                                id="future-action-time-format-inherited"
                                value="inherited" <?php
                            echo $timeFormat === 'inherited' ? 'checked' : ''; ?>/>
                            <label for="future-action-time-format-inherited"><?php
                                esc_html_e('Inherit from Site Settings', 'post-expirator'); ?></label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-time-format"
                                id="future-action-time-format-24h"
                                value="24h" <?php
                            echo $timeFormat === '24h' ? 'checked' : ''; ?>/>
                            <label for="future-action-time-format-24h"><?php
                                esc_html_e('24 hours', 'post-expirator'); ?></label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-time-format"
                                id="future-action-time-format-12h"
                                value="12h" <?php
                            echo $timeFormat === '12h' ? 'checked' : ''; ?>/>
                            <label for="future-action-time-format-12h"><?php
                                esc_html_e('AM/PM', 'post-expirator'); ?></label>
                        </div>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <?php
                        esc_html_e('Choose Which User Roles Can Use PublishPress Future', 'post-expirator'); ?>
                    </th>
                    <td class="pe-checklist">
                        <?php
                        foreach ($user_roles as $role_name => $role_label) : ?>
                            <label for="allow-user-role-<?php
                            echo esc_attr($role_name); ?>">
                                <input type="checkbox"
                                       id="allow-user-role-<?php
                                       echo esc_attr($role_name); ?>"
                                       name="allow-user-roles[]"
                                    <?php
                                    if ('administrator' === $role_name) : echo 'disabled="disabled"'; endif; ?>
                                       value="<?php
                                       echo esc_attr($role_name); ?>"
                                       <?php
                                       if ($plugin_facade->user_role_can_expire_posts(
                                           $role_name
                                       )) : ?>checked="checked"<?php
                                endif; ?>
                                />
                                <?php
                                echo esc_html($role_label); ?>
                            </label>
                        <?php
                        endforeach; ?>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <?php
                        esc_html_e('Preserve Data After Deactivating the Plugin', 'post-expirator'); ?>
                    </th>
                    <td>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="expired-preserve-data-deactivating"
                                id="expired-preserve-data-deactivating-true"
                                value="1" <?php
                            echo $preserveData ? ' checked="checked"' : ''; ?>/>
                            <label for="expired-preserve-data-deactivating-true">
                                <?php
                                esc_html_e('Preserve data', 'post-expirator'); ?>
                            </label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="expired-preserve-data-deactivating"
                                id="expired-preserve-data-deactivating-false"
                                value="0" <?php
                            echo ! $preserveData ? ' checked="checked"' : ''; ?>/>
                            <label for="expired-preserve-data-deactivating-false">
                                <?php
                                esc_html_e('Delete data', 'post-expirator'); ?>
                            </label>
                        </div>
                        <p class="description">
                            <?php
                            esc_html_e(
                                'Toggle between preserving or deleting data after the plugin is deactivated.',
                                'post-expirator'
                            ); ?>
                        </p>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="expirationdateSave" class="button-primary"
                       value="<?php esc_attr_e('Save Changes', 'post-expirator'); ?>"/>
            </p>
        </form>
    </div>

    <?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
    ?>
</div>
