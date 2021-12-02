<?php
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
// phpcs:disable WordPress.PHP.StrictComparisons.LooseComparison

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

$expirationdateDefaultDateFormat = get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
$expirationdateDefaultTimeFormat = get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);

?>

    <form method="post" id="expirationdate_save_options">
        <?php
        wp_nonce_field('postexpirator_menu_display', '_postExpiratorMenuDisplay_nonce'); ?>

        <h3><?php
            _e('Shortcode', 'post-expirator'); ?></h3>
        <p><?php
            echo sprintf(__('Valid %s attributes:', 'post-expirator'), '<code>[postexpirator]</code>'); ?></p>
        <ul class="pe-list">
            <li><p><?php
                    echo sprintf(
                        __(
                            '%1$s - valid options are %2$sfull%3$s (default), %4$sdate%5$s, %6$stime%7$s',
                            'post-expirator'
                        ),
                        '<code>type</code>',
                        '<code>',
                        '</code>',
                        '<code>',
                        '</code>',
                        '<code>',
                        '</code>'
                    ); ?></p></li>
            <li><p><?php
                    echo sprintf(
                        __('%s - format set here will override the value set on the settings page', 'post-expirator'),
                        '<code>dateformat</code>'
                    ); ?></p></li>
            <li><p><?php
                    echo sprintf(
                        __('%s - format set here will override the value set on the settings page', 'post-expirator'),
                        '<code>timeformat</code>'
                    ); ?></p></li>
        </ul>

        <hr/>

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
                    <input type="radio" name="expired-display-footer" id="expired-display-footer-true" value="1" <?php
                    echo $expireddisplayfooterenabled; ?>/> <label for="expired-display-footer-true"><?php
                        _e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expired-display-footer" id="expired-display-footer-false" value="0" <?php
                    echo $expireddisplayfooterdisabled; ?>/> <label for="expired-display-footer-false"><?php
                        _e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'This will enable or disable displaying the post expiration date in the post footer.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expired-footer-contents"><?php
                        _e('Footer Contents', 'post-expirator'); ?></label></th>
                <td>
                    <textarea id="expired-footer-contents" name="expired-footer-contents" rows="3" cols="50"><?php
                        echo $expirationdateFooterContents; ?></textarea>
                    <p class="description"><?php
                        _e(
                            'Enter the text you would like to appear at the bottom of every post that will expire.  The following placeholders will be replaced with the post expiration date in the following format:',
                            'post-expirator'
                        ); ?></p>
                    <ul class="pe-list">
                        <li><p class="description">EXPIRATIONFULL -> <?php
                                echo date_i18n(
                                    "$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat"
                                ); ?></p></li>
                        <li><p class="description">EXPIRATIONDATE -> <?php
                                echo date_i18n("$expirationdateDefaultDateFormat"); ?></p></li>
                        <li><p class="description">EXPIRATIONTIME -> <?php
                                echo date_i18n("$expirationdateDefaultTimeFormat"); ?></p></li>
                    </ul>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expired-footer-style"><?php
                        _e('Footer Style', 'post-expirator'); ?></label></th>
                <td>
                    <input type="text" name="expired-footer-style" id="expired-footer-style" value="<?php
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

        <p class="submit">
            <input type="submit" name="expirationdateSaveDisplay" class="button-primary" value="<?php
            _e('Save Changes', 'post-expirator'); ?>"/>
        </p>
    </form>

<?php
// phpcs:enable
