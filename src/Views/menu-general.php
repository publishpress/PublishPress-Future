<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

$settingsFacade = Container::getInstance()->get(ServicesAbstract::SETTINGS);

// phpcs:disable Generic.Files.LineLength.TooLong

$expirationdateDefaultDateCustom = $settingsFacade->getGeneralDateTimeOffset();
$calendarHiddenByDefault = $settingsFacade->getHideCalendarByDefault();

$userRoles = wp_roles()->get_names();
$pluginFacade = PostExpirator_Facade::getInstance();
?>
<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <form method="post" id="expirationdate_save_options">
            <?php
            wp_nonce_field('postexpirator_menu_general', '_postExpiratorMenuGeneral_nonce'); ?>
            <h3><?php
                esc_html_e('Defaults', 'post-expirator'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><label for="expired-default-expiration-date"><?php
                                                                                    esc_html_e('Default Date/Time Offset', 'post-expirator'); ?></label></th>
                    <td>
                        <div id="expired-custom-container" class="pe-custom-date-container">
                            <input
                                type="text"
                                value="<?php echo esc_attr($expirationdateDefaultDateCustom); ?>"
                                name="expired-custom-expiration-date"
                                placeholder="<?php echo esc_attr(SettingsFacade::DEFAULT_CUSTOM_DATE_OFFSET); ?>"
                                id="expired-custom-expiration-date" />
                            <p class="description">
                                <?php
                                // translators: %1$s is the link to the PHP strtotime function documentation, %2$s and %3$s are the opening and closing code tags. Please, do not translate the date format text, since PHP will not be able to calculate using non-english terms.
                                $description = esc_html__(
                                    'Set the offset to use for the default action date and time. For information on formatting, see %1$s. For example, you could enter %2$s+1 month%3$s or %2$s+1 week 2 days 4 hours 2 seconds%3$s or %2$snext Thursday%3$s. Please, use only terms in English.',
                                    'post-expirator'
                                );

                                echo sprintf(
                                    $description, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                    '<a href="https://www.php.net/manual/en/function.strtotime.php" target="_new">' . esc_html__('PHP strtotime function', 'post-expirator') . '</a>',
                                    '<code>',
                                    '</code>'
                                ); ?></p>

                            <div id="expiration-date-preview"></div>
                        </div>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><label for="expired-hide-calendar-by-default"><?php
                                                    esc_html_e('Calendar Visibility', 'post-expirator'); ?></label></th>
                    <td>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="expired-hide-calendar-by-default" id="expired-hide-calendar-by-default-false"
                                value="0" <?php echo $calendarHiddenByDefault ? '' : 'checked="checked"'; ?> /> <label
                                for="expired-hide-calendar-by-default-false"><?php
                                                esc_html_e('Remember last state', 'post-expirator'); ?></label>
                        </div>
                        <p class="description"><?php esc_html_e('Shows or hides the calendar based on the last user interaction.', 'post-expirator'); ?></p>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="expired-hide-calendar-by-default" id="expired-hide-calendar-by-default-true"
                                value="1" <?php echo $calendarHiddenByDefault ? 'checked="checked"' : ''; ?> /> <label
                                for="expired-hide-calendar-by-default-true"><?php
                                            esc_html_e('Always hidden', 'post-expirator'); ?></label>
                        </div>
                        <p class="description"><?php esc_html_e('The calendar is always hidden by default.', 'post-expirator'); ?></p>
                    </td>
                </tr>
            </table>

            <h3><?php
                esc_html_e('Permissions', 'post-expirator'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <?php
                        esc_html_e('Choose Which User Roles Can Create Future Actions', 'post-expirator'); ?>
                    </th>
                    <td class="pe-checklist">
                        <?php
                        foreach ($userRoles as $role_name => $role_label) : ?>
                            <label for="allow-user-role-<?php
                            echo esc_attr($role_name); ?>">
                                <input type="checkbox"
                                    id="allow-user-role-<?php
                                    echo esc_attr($role_name); ?>"
                                    name="allow-user-roles[]"
                                    <?php
                                    if ('administrator' === $role_name) :
                                        echo 'disabled="disabled"';
                                    endif; ?>
                                    value="<?php
                                    echo esc_attr($role_name); ?>"
                                    <?php
                                    if ($pluginFacade->user_role_can_expire_posts($role_name)) :
                                        ?>checked="checked" <?php
                                    endif;
                                    ?> />
                                <?php echo esc_html(translate_user_role($role_label)); ?>
                            </label>
                            <?php
                        endforeach;
                        ?>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="expirationdateSave" class="button-primary"
                    value="<?php
                    esc_attr_e('Save Changes', 'post-expirator'); ?>" />
            </p>
        </form>
    </div>

    <?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
    ?>
</div>
<?php
// phpcs:enable
