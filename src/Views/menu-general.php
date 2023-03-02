<?php

use PublishPress\WordPressBanners\BannersMain;
use PublishPressFuture\Modules\Settings\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

// Get Option
$expirationdateDefaultDateFormat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
$expirationdateDefaultTimeFormat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
$expiredemailnotification = get_option('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);
$expiredemailnotificationadmins = get_option(
    'expirationdateEmailNotificationAdmins',
    POSTEXPIRATOR_EMAILNOTIFICATIONADMINS
);
$expiredemailnotificationlist = get_option('expirationdateEmailNotificationList', '');

$container = \PublishPressFuture\Core\DI\Container::getInstance();
$settingsFacade = $container->get(\PublishPressFuture\Core\DI\ServicesAbstract::SETTINGS);

$expirationdateDefaultDateCustom = $settingsFacade->getDefaultDateCustom();

$categories = get_option('expirationdateCategoryDefaults');

$preserveData = (bool)get_option('expirationdatePreserveData', true);

$expireddisplayfooter = get_option('expirationdateDisplayFooter', POSTEXPIRATOR_FOOTERDISPLAY);
$expireddisplayfooterenabled = '';
$expireddisplayfooterdisabled = '';
if ($expireddisplayfooter == 0) {
    $expireddisplayfooterdisabled = 'checked="checked"';
} elseif ($expireddisplayfooter == 1) {
    $expireddisplayfooterenabled = 'checked="checked"';
}
$expirationdateFooterContents = get_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);
$expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);

$expiredemailnotificationenabled = '';
$expiredemailnotificationdisabled = '';
if ($expiredemailnotification == 0) {
    $expiredemailnotificationdisabled = 'checked="checked"';
} elseif ($expiredemailnotification == 1) {
    $expiredemailnotificationenabled = 'checked="checked"';
}

$expiredemailnotificationadminsenabled = '';
$expiredemailnotificationadminsdisabled = '';
if ($expiredemailnotificationadmins == 0) {
    $expiredemailnotificationadminsdisabled = 'checked="checked"';
} elseif ($expiredemailnotificationadmins == 1) {
    $expiredemailnotificationadminsenabled = 'checked="checked"';
}

$user_roles = wp_roles()->get_names();
$plugin_facade = PostExpirator_Facade::getInstance();
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
                    <th scope="row"><label for="expired-default-date-format"><?php
                            esc_html_e('Date Format', 'post-expirator'); ?></label></th>
                    <td>
                        <input type="text" name="expired-default-date-format" id="expired-default-date-format" value="<?php
                        echo esc_attr($expirationdateDefaultDateFormat); ?>" size="25"/> <span class="description">(<?php
                            echo esc_html(PostExpirator_Util::get_wp_date($expirationdateDefaultDateFormat, time())); ?>)</span>
                        <p class="description"><?php
                            echo sprintf(
                                esc_html__(
                                    'The default format to use when displaying the expiration date within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                    'post-expirator'
                                ),
                                '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">' . esc_html__('PHP Date Function', 'post-expirator') . '</a>'
                            ); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><label for="expired-default-time-format"><?php
                            esc_html_e('Time Format', 'post-expirator'); ?></label></th>
                    <td>
                        <input type="text" name="expired-default-time-format" id="expired-default-time-format" value="<?php
                        echo esc_attr($expirationdateDefaultTimeFormat); ?>" size="25"/> <span class="description">(<?php
                            echo esc_html(PostExpirator_Util::get_wp_date($expirationdateDefaultTimeFormat, time())); ?>)</span>
                        <p class="description"><?php
                        echo sprintf(
                            esc_html__(
                                'The default format to use when displaying the expiration time within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                'post-expirator'
                            ),
                            '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">'. esc_html__('PHP Date Function', 'post-expirator') . '</a>'

                        ); ?></td>
                </tr>
                <tr valign="top">
                    <th scope="row"><label for="expired-default-expiration-date"><?php
                            esc_html_e('Default date/time offset', 'post-expirator'); ?></label></th>
                    <td>
                        <div id="expired-custom-container" class="pe-custom-date-container">
                            <input type="text" value="<?php
                            echo esc_attr($expirationdateDefaultDateCustom); ?>" name="expired-custom-expiration-date"
                                   id="expired-custom-expiration-date"/>
                            <p class="description"><?php
                                echo sprintf(
                                    esc_html__(
                                        'Set the offset to use for the default expiration date and time. For information on formatting, see %1$s. For example, you could enter %2$s+1 month%3$s or %4$s+1 week 2 days 4 hours 2 seconds%5$s or %6$snext Thursday%7$s.',
                                        'post-expirator'
                                    ),
                                    '<a href="http://php.net/manual/en/function.strtotime.php" target="_new">' . esc_html__('PHP strtotime function', 'post-expirator') . '</a>',
                                    '<code>',
                                    '</code>',
                                    '<code>',
                                    '</code>',
                                    '<code>',
                                    '</code>'
                                ); ?></p>
                        </div>
                    </td>
                </tr>
            </table>

            <h3><?php
                esc_html_e('Expiration Email Notification', 'post-expirator'); ?></h3>
            <p class="description"><?php
                esc_html_e(
                    'Whenever a post expires, an email can be sent to alert users of the expiration.',
                    'post-expirator'
                ); ?></p>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php
                        esc_html_e('Enable Email Notification?', 'post-expirator'); ?></th>
                    <td>
                        <input type="radio" name="expired-email-notification" id="expired-email-notification-true"
                               value="1" <?php
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        echo $expiredemailnotificationenabled; ?>/> <label
                                for="expired-email-notification-true"><?php
                            esc_html_e('Enabled', 'post-expirator'); ?></label>
                        &nbsp;&nbsp;
                        <input type="radio" name="expired-email-notification" id="expired-email-notification-false"
                               value="0" <?php
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        echo $expiredemailnotificationdisabled; ?>/> <label
                                for="expired-email-notification-false"><?php
                            esc_html_e('Disabled', 'post-expirator'); ?></label>
                        <p class="description"><?php
                            esc_html_e(
                                'This will enable or disable the send of email notification on post expiration.',
                                'post-expirator'
                            ); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php
                        esc_html_e('Include Blog Administrators?', 'post-expirator'); ?></th>
                    <td>
                        <input type="radio" name="expired-email-notification-admins"
                               id="expired-email-notification-admins-true"
                               value="1" <?php
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        echo $expiredemailnotificationadminsenabled; ?>/> <label
                                for="expired-email-notification-admins-true"><?php
                            esc_html_e('Enabled', 'post-expirator'); ?></label>
                        &nbsp;&nbsp;
                        <input type="radio" name="expired-email-notification-admins"
                               id="expired-email-notification-admins-false"
                               value="0" <?php
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        echo $expiredemailnotificationadminsdisabled; ?>/> <label
                                for="expired-email-notification-admins-false"><?php
                            esc_html_e('Disabled', 'post-expirator'); ?></label>
                        <p class="description"><?php
                            esc_html_e(
                                'This will include all users with the role of "Administrator" in the post expiration email.',
                                'post-expirator'
                            ); ?></p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row"><label
                                for="expired-email-notification-list"><?php
                            esc_html_e('Who to notify', 'post-expirator'); ?></label>
                    </th>
                    <td>
                        <input class="large-text" type="text" name="expired-email-notification-list"
                               id="expired-email-notification-list" value="<?php
                        echo esc_attr($expiredemailnotificationlist); ?>"/>
                        <p class="description"><?php
                            esc_html_e(
                                'Enter a comma separate list of emails that you would like to be notified when the post expires.  This will be applied to ALL post types.  You can set post type specific emails on the Defaults tab.',
                                'post-expirator'
                            ); ?></p>
                    </td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" name="expirationdateSave" class="button-primary"
                       value="<?php
                       esc_attr_e('Save Changes', 'post-expirator'); ?>"/>
            </p>
        </form>
    </div>

    <?php
    if ($showSideBar) {
        include __DIR__ . '/ad-banner-right-sidebar.php';
    }
    ?>
</div>
