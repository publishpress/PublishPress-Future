<?php
defined('ABSPATH') or die('Direct access not allowed.');

// phpcs:disable Generic.Files.LineLength.TooLong

use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooksAbstract;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

$container = Container::getInstance();
$hooks = $container->get(ServicesAbstract::HOOKS);
$settingsFacade = $container->get(ServicesAbstract::SETTINGS);
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
// phpcs:disable WordPress.PHP.StrictComparisons.LooseComparison

$expireddisplayfooter = $settingsFacade->getShowInPostFooter();
$expirationdateFooterContents = $settingsFacade->getFooterContents();
$expirationdateFooterStyle = $settingsFacade->getFooterStyle();

$expirationdateDefaultDateFormat = $settingsFacade->getDefaultDateFormat();
$expirationdateDefaultTimeFormat = $settingsFacade->getDefaultTimeFormat();

$metaboxTitle = $settingsFacade->getMetaboxTitle();
$metaboxCheckboxLabel = $settingsFacade->getMetaboxCheckboxLabel();

$timeFormat = $settingsFacade->getTimeFormatForDatePicker();
$columnStyle = $settingsFacade->getColumnStyle();

?>
<div class="pp-columns-wrapper<?php echo $showSideBar ? ' pp-enable-sidebar' : ''; ?>">
    <div class="pp-column-left">
        <form method="post" id="expirationdate_save_options">
            <?php
            wp_nonce_field('postexpirator_menu_display', '_postExpiratorMenuDisplay_nonce'); ?>

            <h3><?php esc_html_e('Default Formats', 'post-expirator'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="expired-default-date-format">
                            <?php esc_html_e('Date Format', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            name="expired-default-date-format"
                            id="expired-default-date-format"
                            value="<?php echo esc_attr($expirationdateDefaultDateFormat); ?>"
                            size="25"
                        /> <span class="description">(
                            <?php
                            echo esc_html(PostExpirator_Util::get_wp_date($expirationdateDefaultDateFormat, time())); ?>
                        )</span>
                        <p class="description">
                            <?php
                            echo sprintf(
                                // translators: %s is a link to the PHP date function documentation
                                esc_html__(
                                    'The default format to use when displaying the action date within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                    'post-expirator'
                                ),
                                '<a href="https://www.php.net/manual/en/function.date.php" target="_blank">' . esc_html__('PHP Date Function', 'post-expirator') . '</a>'
                            ); ?>
                        </p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <label for="expired-default-time-format">
                            <?php
                            esc_html_e('Time Format', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            name="expired-default-time-format"
                            id="expired-default-time-format"
                            value="<?php echo esc_attr($expirationdateDefaultTimeFormat); ?>"
                            size="25"
                        /> <span class="description">(
                            <?php
                            echo esc_html(PostExpirator_Util::get_wp_date($expirationdateDefaultTimeFormat, time())); ?>
                        )</span>
                        <p class="description">
                            <?php
                            echo sprintf(
                                // translators: %s is a link to the PHP date function documentation
                                esc_html__(
                                    'The default format to use when displaying the action time within a post using the shortcode or within the footer.  For information on valid formatting options, see: %s.',
                                    'post-expirator'
                                ),
                                '<a href="https://www.php.net/manual/en/function.date.php" target="_blank">' . esc_html__('PHP Date Function', 'post-expirator') . '</a>'
                            ); ?>
                        </p>
                    </td>
                </tr>
            </table>

            <hr />

            <h3><?php
                esc_html_e('Metabox', 'post-expirator'); ?></h3>

            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="expirationdate-metabox-title">
                            <?php
                            esc_html_e('Metabox Title', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            name="expirationdate-metabox-title"
                            id="expirationdate-metabox-title"
                            value="<?php echo esc_attr($metaboxTitle); ?>"
                            size="25"
                            placeholder="<?php esc_attr_e('Future Actions', 'post-expirator'); ?>"
                        />
                        <p class="description">
                            <?php
                            esc_html_e('The title of the metabox that will be displayed in the post edit screen.', 'post-expirator'); ?>
                        </p>
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">
                        <label for="expirationdate-metabox-checkbox-label">
                            <?php
                            esc_html_e('Checkbox Field Label', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <input
                            type="text"
                            name="expirationdate-metabox-checkbox-label"
                            id="expirationdate-metabox-checkbox-label"
                            value="<?php echo esc_attr($metaboxCheckboxLabel); ?>"
                            size="25"
                            placeholder="<?php esc_attr_e('Enable Future Action', 'post-expirator'); ?>"
                        />
                        <p class="description">
                            <?php esc_html_e('The label of the checkbox field that will be displayed in the metabox.', 'post-expirator'); ?>
                        </p>
                    </td>
                </tr>
            </table>

            <hr />

            <h3><?php esc_html_e('Future Actions Column', 'post-expirator'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="future-action-column-style">
                            <?php esc_html_e('Future Action Column Style', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-column-style"
                                id="future-action-column-style-verbose"
                                value="verbose" <?php
                                                echo $columnStyle === 'verbose' ? 'checked' : ''; ?> />
                            <label for="future-action-column-style-verbose">
                                <?php esc_html_e('Detailed', 'post-expirator'); ?>
                            </label>
                            <p class="description offset">
                                <?php esc_html_e('Displays all information in the Future Action column.', 'post-expirator'); ?>
                            </p>
                        </div>

                        <div class="pp-settings-field-row">
                            <input type="radio" name="future-action-column-style"
                                id="future-action-column-style-simple"
                                value="simple" <?php
                                                echo $columnStyle === 'simple' ? 'checked' : ''; ?> />
                            <label for="future-action-column-style-simple"><?php
                                                                            esc_html_e('Simplified', 'post-expirator'); ?></label>
                            <p class="description offset">
                                <?php esc_html_e('Displays only the icon and date/time.', 'post-expirator'); ?>
                            </p>
                        </div>
                    </td>
                </tr>
            </table>

            <hr />

            <h3><?php
                esc_html_e('Future Actions Editor', 'post-expirator'); ?></h3>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="future-action-time-format">
                            <?php esc_html_e('Time format in the date picker', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <div class="pp-settings-field-row">
                            <input
                                type="radio"
                                name="future-action-time-format"
                                id="future-action-time-format-inherited"
                                value="inherited"
                                <?php echo $timeFormat === 'inherited' ? 'checked' : ''; ?> />
                            <label for="future-action-time-format-inherited">
                                <?php esc_html_e('Inherit from Site Settings', 'post-expirator'); ?>
                            </label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input
                                type="radio"
                                name="future-action-time-format"
                                id="future-action-time-format-24h"
                                value="24h"
                                <?php echo $timeFormat === '24h' ? 'checked' : ''; ?> />
                            <label for="future-action-time-format-24h">
                                <?php esc_html_e('24 hours', 'post-expirator'); ?>
                            </label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input
                                type="radio"
                                name="future-action-time-format"
                                id="future-action-time-format-12h"
                                value="12h"
                                <?php echo $timeFormat === '12h' ? 'checked' : ''; ?> />
                            <label for="future-action-time-format-12h">
                                <?php esc_html_e('AM/PM', 'post-expirator'); ?>
                            </label>
                        </div>
                    </td>
                </tr>
            </table>

            <hr />

            <h3><?php
                esc_html_e('Post Footer Display', 'post-expirator'); ?></h3>
            <p class="description">
                <?php esc_html_e(
                    'Enabling this below will display the action date automatically at the end of any post which is set to run an action.',
                    'post-expirator'
                ); ?>
            </p>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">
                        <label for="expired-display-footer">
                            <?php esc_html_e('Show in Post Footer?', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <div class="pp-settings-field-row">
                            <input
                                type="radio"
                                name="expired-display-footer"
                                id="expired-display-footer-true"
                                value="1"
                                <?php echo $expireddisplayfooter ? 'checked' : ''; ?> />
                            <label for="expired-display-footer-true">
                                <?php esc_html_e('Enabled', 'post-expirator'); ?>
                            </label>
                        </div>
                        <div class="pp-settings-field-row">
                            <input
                                type="radio"
                                name="expired-display-footer"
                                id="expired-display-footer-false"
                                value="0"
                                <?php echo !$expireddisplayfooter ? 'checked' : ''; ?> />
                            <label for="expired-display-footer-false">
                                <?php esc_html_e('Disabled', 'post-expirator'); ?>
                            </label>
                        </div>
                        <p class="description">
                            <?php esc_html_e(
                                'This will enable or disable displaying the future action date in the post footer.',
                                'post-expirator'
                            ); ?>
                        </p>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <label for="expired-footer-contents">
                            <?php esc_html_e('Footer Contents', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <textarea
                            id="expired-footer-contents"
                            name="expired-footer-contents"
                            rows="3"
                            cols="50"
                        ><?php echo esc_textarea($expirationdateFooterContents); ?></textarea>
                        <p class="description">
                            <?php esc_html_e(
                                'Enter the text you would like to appear at the bottom of every post which has an action scheduled.  The following placeholders will be replaced with the future action date in the following format:',
                                'post-expirator'
                            ); ?>
                        </p>
                        <ul class="pe-list">
                            <li>
                                <p class="description">
                                    ACTIONFULL ->
                                    <?php echo esc_html(date_i18n(
                                        "$expirationdateDefaultDateFormat $expirationdateDefaultTimeFormat"
                                    )); ?>
                                </p>
                            </li>
                            <li>
                                <p class="description">
                                    ACTIONDATE ->
                                    <?php echo esc_html(date_i18n("$expirationdateDefaultDateFormat")); ?>
                                </p>
                            </li>
                            <li>
                                <p class="description">
                                    ACTIONTIME ->
                                    <?php echo esc_html(date_i18n("$expirationdateDefaultTimeFormat")); ?>
                                </p>
                            </li>
                        </ul>
                    </td>
                </tr>
                <tr valign="top">
                    <th scope="row">
                        <label for="expired-footer-style">
                            <?php esc_html_e('Footer Style', 'post-expirator'); ?>
                        </label>
                    </th>
                    <td>
                        <textarea
                            name="expired-footer-style"
                            id="expired-footer-style"
                            rows="3"
                            cols="50"
                        ><?php echo esc_textarea($expirationdateFooterStyle); ?></textarea>
                        <p class="description">
                            <?php esc_html_e('The inline css which will be used to style the footer text.', 'post-expirator'); ?>
                        </p>
                        <br>
                        <div>
                            <label><?php echo esc_html__('Example: ', 'post-expirator'); ?></label>
                            <div style="background: white; padding: 10px; <?php echo esc_attr($expirationdateFooterStyle); ?>">
                                <?php echo esc_html($hooks->applyFilters(ExpiratorHooksAbstract::FILTER_CONTENT_FOOTER, '', true)); ?>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

            <hr />

            <h3><?php
                esc_html_e('Shortcode', 'post-expirator'); ?></h3>
            <p><?php
                // translators: %s is the shortcode code wrapped in code tags
                echo sprintf(esc_html__('Valid %s attributes:', 'post-expirator'), '<code>[futureaction]</code>'); ?></p>
            <ul class="pe-list">
                <li>
                    <p><?php
                        echo sprintf(
                            // translators: %1$s and %2$s are code tags that wrap the shortcode attribute names
                            esc_html__(
                                '%1$stype%2$s - valid options are %1$sfull%2$s (default), %1$sdate%2$s, %1$stime%2$s',
                                'post-expirator'
                            ),
                            '<code>',
                            '</code>'
                        ); ?></p>
                </li>
                <li>
                    <p><?php
                        echo sprintf(
                            // translators: %s is a code tag that wraps the shortcode attribute dateformat
                            esc_html__('%s - format set here will override the value set on the settings page', 'post-expirator'),
                            '<code>dateformat</code>'
                        ); ?></p>
                </li>
                <li>
                    <p><?php
                        echo sprintf(
                            // translators: %s is a code tag that wraps the shortcode attribute timeformat
                            esc_html__('%s - format set here will override the value set on the settings page', 'post-expirator'),
                            '<code>timeformat</code>'
                        ); ?></p>
                </li>
            </ul>

            <p class="submit">
                <input
                    type="submit"
                    name="expirationdateSaveDisplay"
                    class="button-primary"
                    value="<?php esc_attr_e('Save Changes', 'post-expirator'); ?>"
                />
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
