<?php

// Get Option
$expirationdateDefaultDateFormat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
$expirationdateDefaultTimeFormat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
$expireddisplayfooter = get_option('expirationdateDisplayFooter', POSTEXPIRATOR_FOOTERDISPLAY);
$expiredemailnotification = get_option('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);
$expiredemailnotificationadmins = get_option(
    'expirationdateEmailNotificationAdmins',
    POSTEXPIRATOR_EMAILNOTIFICATIONADMINS
);
$expiredemailnotificationlist = get_option('expirationdateEmailNotificationList', '');
$expirationdateFooterContents = get_option('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);
$expirationdateFooterStyle = get_option('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);
$expirationdateDefaultDate = get_option('expirationdateDefaultDate', POSTEXPIRATOR_EXPIREDEFAULT);
$expirationdateDefaultDateCustom = get_option('expirationdateDefaultDateCustom');

$categories = get_option('expirationdateCategoryDefaults');

$expireddisplayfooterenabled = '';
$expireddisplayfooterdisabled = '';
if ($expireddisplayfooter == 0) {
    $expireddisplayfooterdisabled = 'checked="checked"';
} elseif ($expireddisplayfooter == 1) {
    $expireddisplayfooterenabled = 'checked="checked"';
}

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
    <p><?php
        _e(
            'The post expirator plugin sets a custom meta value, and then optionally allows you to select if you want the post changed to a draft status or deleted when it expires.',
            'post-expirator'
        ); ?></p>

    <h3><?php
        _e('Shortcode', 'post-expirator'); ?></h3>
    <p><?php
        echo sprintf(__('Valid %s attributes:', 'post-expirator'), '<code>[postexpirator]</code>'); ?></p>
    <ul class="pe-list">
        <li>
            <p><?php
                echo sprintf(
                    __('%1$s - valid options are %2$sfull%3$s (default), %4$sdate%5$s, %6$stime%7$s', 'post-expirator'),
                    '<code>type</code>',
                    '<code>',
                    '</code>',
                    '<code>',
                    '</code>',
                    '<code>',
                    '</code>'
                ); ?></p>
        </li>
        <li>
            <p><?php
                echo sprintf(
                    __('%s - format set here will override the value set on the settings page', 'post-expirator'),
                    '<code>dateformat</code>'
                ); ?></p>
        </li>
        <li>
            <p><?php
                echo sprintf(
                    __('%s - format set here will override the value set on the settings page', 'post-expirator'),
                    '<code>timeformat</code>'
                ); ?></p>
        </li>
    </ul>
    <hr/>

    <form method="post" id="expirationdate_save_options">
        <?php
        wp_nonce_field('postexpirator_menu_general', '_postExpiratorMenuGeneral_nonce'); ?>
        <h3><?php
            _e('Defaults', 'post-expirator'); ?></h3>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><label
                            for="expired-default-date-format"><?php
                        _e('Date Format', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input type="text" name="expired-default-date-format" id="expired-default-date-format"
                           value="<?php
                           echo $expirationdateDefaultDateFormat; ?>" size="25"/> <span
                            class="description">(<?php
                        echo date_i18n("$expirationdateDefaultDateFormat"); ?>)</span>
                    <p class="description"><?php
                        echo sprintf(
                            __(
                                'The default format to use when displaying the expiration date within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                'post-expirator'
                            ),
                            '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expired-default-time-format"><?php
                        _e('Time Format', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input type="text" name="expired-default-time-format" id="expired-default-time-format"
                           value="<?php
                           echo $expirationdateDefaultTimeFormat; ?>" size="25"/> <span
                            class="description">(<?php
                        echo date_i18n("$expirationdateDefaultTimeFormat"); ?>)</span>
                    <p class="description"><?php
                        echo sprintf(
                            __(
                                'The default format to use when displaying the expiration time within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                'post-expirator'
                            ),
                            '<a href="http://us2.php.net/manual/en/function.date.php" target="_blank">PHP Date Function</a>'
                        ); ?>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expired-default-expiration-date"><?php
                        _e('Default Date/Time Duration', 'post-expirator'); ?></label>
                </th>
                <td>
                    <select name="expired-default-expiration-date" id="expired-default-expiration-date"
                            class="pe-custom-date-toggle">
                        <option value="null" <?php
                        echo ($expirationdateDefaultDate == 'null') ? ' selected="selected"' : ''; ?>><?php
                            _e('None', 'post-expirator'); ?></option>
                        <option value="custom" <?php
                        echo ($expirationdateDefaultDate == 'custom') ? ' selected="selected"' : ''; ?>><?php
                            _e('Custom', 'post-expirator'); ?></option>
                        <option value="publish" <?php
                        echo ($expirationdateDefaultDate == 'publish') ? ' selected="selected"' : ''; ?>><?php
                            _e('Post/Page Publish Time', 'post-expirator'); ?></option>
                    </select>
                    <p class="description"><?php
                        _e(
                            'Set the default expiration date to be used when creating new posts and pages.  Defaults to none.',
                            'post-expirator'
                        ); ?></p>
                    <?php
                    $show = ($expirationdateDefaultDate == 'custom') ? 'block' : 'none'; ?>
                    <div id="expired-custom-container" style="display: <?php
                    echo $show; ?>;"
                         class="pe-custom-date-container">
                        <br/>
                        <label for="expired-custom-expiration-date"><?php
                            _e('Custom', 'post-expirator'); ?>:</label>
                        <input type="text" value="<?php
                        echo $expirationdateDefaultDateCustom; ?>"
                               name="expired-custom-expiration-date" id="expired-custom-expiration-date"/>
                        <p class="description"><?php
                            echo sprintf(
                                __(
                                    'Set the custom value to use for the default expiration date.  For information on formatting, see %1$s. For example, you could enter %2$s+1 month%3$s or %4$s+1 week 2 days 4 hours 2 seconds%5$s or %6$snext Thursday%7$s.',
                                    'post-expirator'
                                ),
                                '<a href="http://php.net/manual/en/function.strtotime.php" target="_new">PHP strtotime function</a>',
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
            <tr valign="top">
                <th scope="row"><?php
                    _e('Default Expiration Category', 'post-expirator'); ?></th>
                <td>
                    <?php
                    echo '<div class="wp-tab-panel" id="post-expirator-cat-list">';
                    echo '<ul id="categorychecklist" class="list:category categorychecklist form-no-clear">';
                    $walker = new Walker_PostExpirator_Category_Checklist();
                    wp_terms_checklist(0, array(
                        'taxonomy' => 'category',
                        'walker' => $walker,
                        'selected_cats' => $categories,
                        'checked_ontop' => false
                    ));
                    echo '</ul>';
                    echo '</div>';
                    ?>
                    <p class="description"><?php
                        _e('Sets the default expiration category for the post.', 'post-expirator'); ?></p>
                </td>
            </tr>
        </table>

        <h3><?php
            _e('Expiration Email Notification', 'post-expirator'); ?></h3>
        <p class="description"><?php
            _e(
                'Whenever a post expires, an email can be sent to alert users of the expiration.',
                'post-expirator'
            ); ?></p>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><?php
                    _e('Enable Email Notification?', 'post-expirator'); ?></th>
                <td>
                    <input type="radio" name="expired-email-notification" id="expired-email-notification-true"
                           value="1" <?php
                    echo $expiredemailnotificationenabled; ?>/> <label
                            for="expired-email-notification-true"><?php
                        _e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expired-email-notification" id="expired-email-notification-false"
                           value="0" <?php
                    echo $expiredemailnotificationdisabled; ?>/> <label
                            for="expired-email-notification-false"><?php
                        _e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'This will enable or disable the send of email notification on post expiration.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><?php
                    _e('Include Blog Administrators?', 'post-expirator'); ?></th>
                <td>
                    <input type="radio" name="expired-email-notification-admins"
                           id="expired-email-notification-admins-true"
                           value="1" <?php
                    echo $expiredemailnotificationadminsenabled; ?>/> <label
                            for="expired-email-notification-admins-true"><?php
                        _e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expired-email-notification-admins"
                           id="expired-email-notification-admins-false"
                           value="0" <?php
                    echo $expiredemailnotificationadminsdisabled; ?>/> <label
                            for="expired-email-notification-admins-false"><?php
                        _e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'This will include all users with the role of "Administrator" in the post expiration email.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expired-email-notification-list"><?php
                        _e('Who to notify', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input class="large-text" type="text" name="expired-email-notification-list"
                           id="expired-email-notification-list" value="<?php
                    echo $expiredemailnotificationlist; ?>"/>
                    <p class="description"><?php
                        _e(
                            'Enter a comma separate list of emails that you would like to be notified when the post expires.  This will be applied to ALL post types.  You can set post type specific emails on the Defaults tab.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
        </table>

        <h3><?php
            _e('Post Footer Display', 'post-expirator'); ?></h3>
        <p class="description"><?php
            _e(
                'Enabling this below will display the expiration date automatically at the end of any post which is set to expire.',
                'post-expirator'
            ); ?></p>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><?php
                    _e('Show in post footer?', 'post-expirator'); ?></th>
                <td>
                    <input type="radio" name="expired-display-footer" id="expired-display-footer-true"
                           value="1" <?php
                    echo $expireddisplayfooterenabled; ?>/> <label
                            for="expired-display-footer-true"><?php
                        _e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expired-display-footer" id="expired-display-footer-false"
                           value="0" <?php
                    echo $expireddisplayfooterdisabled; ?>/> <label
                            for="expired-display-footer-false"><?php
                        _e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'This will enable or disable displaying the post expiration date in the post footer.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expired-footer-contents"><?php
                        _e('Footer Contents', 'post-expirator'); ?></label>
                </th>
                <td>
					<textarea id="expired-footer-contents" name="expired-footer-contents" rows="3"
                              cols="50"><?php
                        echo $expirationdateFooterContents; ?></textarea>
                    <p class="description"><?php
                        _e(
                            'Enter the text you would like to appear at the bottom of every post that will expire.  The following placeholders will be replaced with the post expiration date in the following format:',
                            'post-expirator'
                        ); ?></p>
                    <ul class="pe-list">
                        <li><p class="description">EXPIRATIONFULL
                                -> <?php
                                echo date_i18n(
                                    "$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat"
                                ); ?></p>
                        </li>
                        <li><p class="description">EXPIRATIONDATE
                                -> <?php
                                echo date_i18n("$expirationdateDefaultDateFormat"); ?></p></li>
                        <li><p class="description">EXPIRATIONTIME
                                -> <?php
                                echo date_i18n("$expirationdateDefaultTimeFormat"); ?></p></li>
                    </ul>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expired-footer-style"><?php
                        _e('Footer Style', 'post-expirator'); ?></label></th>
                <td>
                    <input type="text" name="expired-footer-style" id="expired-footer-style"
                           value="<?php
                           echo $expirationdateFooterStyle; ?>" size="25"/>
                    (<span style="<?php
                    echo $expirationdateFooterStyle; ?>"><?php
                        _e('This post will expire on', 'post-expirator'); ?><?php
                        echo date_i18n("$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat"); ?></span>)
                    <p class="description"><?php
                        _e('The inline css which will be used to style the footer text.', 'post-expirator'); ?></p>
                </td>
            </tr>
        </table>

        <h3><?php
            _e('Advanced Options', 'post-expirator'); ?></h3>
        <p class="description"><?php
            _e(
                'Please do not update anything here unless you know what it entails. For advanced users only.',
                'post-expirator'
            ); ?></p>
        <?php
        $gutenberg = get_option('expirationdateGutenbergSupport', 1);
        ?>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><?php
                    _e('Block Editor Support', 'post-expirator'); ?></th>
                <td>
                    <input type="radio" name="gutenberg-support" id="gutenberg-support-enabled"
                           value="1" <?php
                    echo intval($gutenberg) === 1 ? 'checked' : ''; ?>/> <label
                            for="gutenberg-support-enabled"><?php
                        _e('Show Gutenberg style box', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="gutenberg-support" id="gutenberg-support-disabled"
                           value="0" <?php
                    echo intval($gutenberg) === 0 ? 'checked' : ''; ?>/> <label
                            for="gutenberg-support-disabled"><?php
                        _e('Show Classic Editor style box', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'Toggle between native support for the Block Editor or the backward compatible Classic Editor style metabox.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row">
                    <?php
                    _e('Choose which user roles can use Post Expirator', 'post-expirator'); ?>
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
        </table>

        <p class="submit">
            <input type="submit" name="expirationdateSave" class="button-primary"
                   value="<?php
                   _e('Save Changes', 'post-expirator'); ?>"/>
        </p>
    </form>

<?php
