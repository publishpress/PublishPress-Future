<?php

defined('ABSPATH') or die('Direct access not allowed.');

$container = \PublishPressFuture\Core\DI\Container::getInstance();
$settingsFacade = $container->get(\PublishPressFuture\Core\DI\ServicesAbstract::SETTINGS);
?>

<form method="post">
    <?php
    wp_nonce_field('postexpirator_menu_defaults', '_postExpiratorMenuDefaults_nonce'); ?>
    <h3><?php
        esc_html_e('Default Expiration Values', 'post-expirator'); ?></h3>

    <p><?php
        esc_html_e(
            'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.',
            'post-expirator'
        ); ?></p>

    <?php
    foreach ($types as $postType) {
        $postTypeObject = get_post_type_object($postType);
        $singularName = $postTypeObject->labels->singular_name;
        echo '<fieldset>';
        echo '<legend>&nbsp;' . esc_html($singularName) . '&nbsp;</legend>';

        $defaults = $settingsFacade->getPostTypeDefaults($postType);

        // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
        if (isset($defaults['autoEnable']) && $defaults['autoEnable'] == 1) {
            $expiredautoenabled = 'checked = "checked"';
            $expiredautodisabled = '';
        } else {
            $expiredautoenabled = '';
            $expiredautodisabled = 'checked = "checked"';
        }

        $expiredactivemetaenabled = '';
        $expiredactivemetadisabled = 'checked = "checked"';

        // if settings are not configured, show the metabox by default only for posts and pages
        if (! isset($defaults['activeMetaBox']) && in_array($postType, array('post', 'page'), true)) {
            $expiredactivemetaenabled = 'checked = "checked"';
            $expiredactivemetadisabled = '';
        } elseif (isset($defaults['activeMetaBox'])) {
            if ($defaults['activeMetaBox'] === 'inactive') {
                $expiredactivemetaenabled = '';
                $expiredactivemetadisabled = 'checked = "checked"';
            } else {
                $expiredactivemetadisabled = '';
                $expiredactivemetaenabled = 'checked = "checked"';
            }
        }
        if (! isset($defaults['taxonomy'])) {
            $defaults['taxonomy'] = false;
        }
        if (! isset($defaults['emailnotification'])) {
            $defaults['emailnotification'] = '';
        }
        if (! isset($defaults['default-expire-type'])) {
            $defaults['default-expire-type'] = '';
        }
        ?>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><label for="expirationdate_activemeta-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Active', 'post-expirator'); ?></label></th>
                <td>
                    <input type="radio" name="expirationdate_activemeta-<?php
                    echo esc_attr($postType); ?>" id="expirationdate_activemeta-true-<?php
                    echo esc_attr($postType); ?>" value="active" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $expiredactivemetaenabled; ?>/> <label for="expirationdate_activemeta-true-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Active', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expirationdate_activemeta-<?php
                    echo esc_attr($postType); ?>" id="expirationdate_activemeta-false-<?php
                    echo esc_attr($postType); ?>" value="inactive" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $expiredactivemetadisabled; ?>/> <label for="expirationdate_activemeta-false-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Inactive', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        esc_html_e(
                            'Select whether the PublishPress Future meta box is active for this post type.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expirationdate_expiretype-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('How to expire', 'post-expirator'); ?></label></th>
                <td>
                    <?php
                    _postexpirator_expire_type(
                        array(
                            'name' => 'expirationdate_expiretype-' . esc_attr($postType),
                            'selected' => (isset($defaults['expireType']) ? $defaults['expireType'] : '')
                        )
                    ); ?>
                    <p class="description"><?php
                        esc_html_e('Select the default expire action for the post type.', 'post-expirator'); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expirationdate_autoenable-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Auto-Enable?', 'post-expirator'); ?></label></th>
                <td>
                    <input type="radio" name="expirationdate_autoenable-<?php
                    echo esc_attr($postType); ?>" id="expirationdate_autoenable-true-<?php
                    echo esc_attr($postType); ?>" value="1" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $expiredautoenabled; ?>/> <label for="expirationdate_autoenable-true-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expirationdate_autoenable-<?php
                    echo esc_attr($postType); ?>" id="expirationdate_autoenable-false-<?php
                    echo esc_attr($postType); ?>" value="0" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $expiredautodisabled; ?>/> <label for="expirationdate_autoenable-false-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        esc_html_e(
                            'Select whether the PublishPress Future is enabled for all new posts.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expirationdate_taxonomy-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Taxonomy (hierarchical)', 'post-expirator'); ?></label></th>
                <td>
                    <?php
                        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                        echo _postexpirator_taxonomy(
                            [
                                'type' => $postType,
                                'name' => 'expirationdate_taxonomy-' . $postType,
                                'selected' => $defaults['taxonomy']
                            ]
                            );
                    ?>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="expirationdate_emailnotification-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Who to notify', 'post-expirator'); ?></label></th>
                <td>
                    <input class="large-text" type="text" name="expirationdate_emailnotification-<?php
                    echo esc_attr($postType); ?>" id="expirationdate_emailnotification-<?php
                    echo esc_attr($postType); ?>" value="<?php
                    echo esc_attr($defaults['emailnotification']); ?>"/>
                    <p class="description"><?php
                        esc_html_e(
                            'Enter a comma separate list of emails that you would like to be notified when the post expires.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <?php
            $values = array(
                'inherit' => esc_html__('Inherit from General Settings', 'post-expirator'),
                'custom' => esc_html__('Custom', 'post-expirator'),
                'publish' => esc_html__('Publish Time', 'post-expirator'),
            );

            $show = 'none';
            $customDate = '';
            if ($defaults['default-expire-type'] === 'custom') {
                $show = 'block';
                $customDate = $defaults['default-custom-date'];
            }

            ?>

            <tr valign="top">
                <th scope="row"><label for="expired-default-date-<?php
                    echo esc_attr($postType); ?>"><?php
                        esc_html_e('Default Date/Time Duration', 'post-expirator'); ?></label></th>
                <td>
                    <select name="expired-default-date-<?php
                    echo esc_attr($postType); ?>" id="expired-default-date-<?php
                    echo esc_attr($postType); ?>" class="pe-custom-date-toggle">
                        <?php
                        foreach ($values as $value => $label) { ?>
                            <option value="<?php
                            echo esc_attr($value); ?>" <?php
                            selected($value, $defaults['default-expire-type']); ?>><?php
                                echo esc_html($label); ?></option>
                            <?php
                        } ?>
                    </select>
                    <p class="description"><?php
                        esc_html_e(
                            'Set the default expiration date to be used when creating a new post of this type.',
                            'post-expirator'
                        ); ?></p>
                    <div id="expired-custom-container-<?php
                    echo esc_attr($postType); ?>" class="pe-custom-date-container" style="display: <?php
                    echo esc_attr($show); ?>;">
                        <br/>
                        <label for="expired-custom-date-<?php
                        echo esc_attr($postType); ?>"><?php
                            esc_html_e('Custom', 'post-expirator'); ?>:</label>
                        <input type="text" value="<?php
                        echo esc_attr($customDate); ?>" name="expired-custom-date-<?php
                        echo esc_attr($postType); ?>" id="expired-custom-date-<?php
                        echo esc_attr($postType); ?>"/>
                        <p class="description"><?php
                            echo sprintf(
                                esc_html__(
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
        </table>
        </fieldset>
        <?php
    }
    ?>
    <p class="submit">
        <input type="submit" name="expirationdateSaveDefaults" class="button-primary" value="<?php
        esc_attr_e('Save Changes', 'post-expirator'); ?>"/>
    </p>
</form>
