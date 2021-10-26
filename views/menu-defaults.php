<form method="post">
    <?php
    wp_nonce_field('postexpirator_menu_defaults', '_postExpiratorMenuDefaults_nonce'); ?>
    <h3><?php
        _e('Default Expiration Values', 'post-expirator'); ?></h3>

    <p><?php
        _e(
            'Use the values below to set the default actions/values to be used for each for the corresponding post types.  These values can all be overwritten when creating/editing the post/page.',
            'post-expirator'
        ); ?></p>

    <?php
    foreach ($types as $type) {
        $post_type_object = get_post_type_object($type);
        echo '<fieldset>';
        echo "<legend>&nbsp;{$post_type_object->labels->singular_name}&nbsp;</legend>";
        $defaults = get_option('expirationdateDefaults' . ucfirst($type));

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
        if (! isset($defaults['activeMetaBox']) && in_array($type, array('post', 'page'), true)) {
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
                <th scope="row"><label
                            for="expirationdate_activemeta-<?php
                            echo $type; ?>"><?php
                        _e('Active', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input type="radio" name="expirationdate_activemeta-<?php
                    echo $type; ?>"
                           id="expirationdate_activemeta-true-<?php
                           echo $type; ?>"
                           value="active" <?php
                    echo $expiredactivemetaenabled; ?>/> <label
                            for="expirationdate_activemeta-true-<?php
                            echo $type; ?>"><?php
                        _e('Active', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expirationdate_activemeta-<?php
                    echo $type; ?>"
                           id="expirationdate_activemeta-false-<?php
                           echo $type; ?>"
                           value="inactive" <?php
                    echo $expiredactivemetadisabled; ?>/> <label
                            for="expirationdate_activemeta-false-<?php
                            echo $type; ?>"><?php
                        _e('Inactive', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e(
                            'Select whether the post expirator meta box is active for this post type.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expirationdate_expiretype-<?php
                            echo $type; ?>"><?php
                        _e('How to expire', 'post-expirator'); ?></label>
                </th>
                <td>
                    <?php
                    _postexpirator_expire_type(array(
                        'name' => 'expirationdate_expiretype-' . $type,
                        'selected' => (isset($defaults['expireType']) ? $defaults['expireType'] : '')
                    )); ?>
                    <p class="description"><?php
                        _e('Select the default expire action for the post type.', 'post-expirator'); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expirationdate_autoenable-<?php
                            echo $type; ?>"><?php
                        _e('Auto-Enable?', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input type="radio" name="expirationdate_autoenable-<?php
                    echo $type; ?>"
                           id="expirationdate_autoenable-true-<?php
                           echo $type; ?>"
                           value="1" <?php
                    echo $expiredautoenabled; ?>/> <label
                            for="expirationdate_autoenable-true-<?php
                            echo $type; ?>"><?php
                        _e('Enabled', 'post-expirator'); ?></label>
                    &nbsp;&nbsp;
                    <input type="radio" name="expirationdate_autoenable-<?php
                    echo $type; ?>"
                           id="expirationdate_autoenable-false-<?php
                           echo $type; ?>"
                           value="0" <?php
                    echo $expiredautodisabled; ?>/> <label
                            for="expirationdate_autoenable-false-<?php
                            echo $type; ?>"><?php
                        _e('Disabled', 'post-expirator'); ?></label>
                    <p class="description"><?php
                        _e('Select whether the post expirator is enabled for all new posts.', 'post-expirator'); ?></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expirationdate_taxonomy-<?php
                            echo $type; ?>"><?php
                        _e('Taxonomy (hierarchical)', 'post-expirator'); ?></label>
                </th>
                <td>
                    <?php
                    echo _postexpirator_taxonomy(array(
                        'type' => $type,
                        'name' => 'expirationdate_taxonomy-' . $type,
                        'selected' => $defaults['taxonomy']
                    )); ?>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label
                            for="expirationdate_emailnotification-<?php
                            echo $type; ?>"><?php
                        _e('Who to notify', 'post-expirator'); ?></label>
                </th>
                <td>
                    <input class="large-text" type="text" name="expirationdate_emailnotification-<?php
                    echo $type; ?>"
                           id="expirationdate_emailnotification-<?php
                           echo $type; ?>"
                           value="<?php
                           echo $defaults['emailnotification']; ?>"/>
                    <p class="description"><?php
                        _e(
                            'Enter a comma separate list of emails that you would like to be notified when the post expires.',
                            'post-expirator'
                        ); ?></p>
                </td>
            </tr>
            <?php
            $values = array(
                '' => __('None', 'post-expirator'),
                'inherit' => __('Inherit from General Settings', 'post-expirator'),
                'custom' => __('Custom', 'post-expirator'),
                'publish' => __('Publish Time', 'post-expirator'),
            );

            $show = 'none';
            $customDate = '';
            if ($defaults['default-expire-type'] === 'custom') {
                $show = 'block';
                $customDate = $defaults['default-custom-date'];
            }

            ?>

            <tr valign="top">
                <th scope="row"><label
                            for="expired-default-date-<?php
                            echo $type; ?>"><?php
                        _e('Default Date/Time Duration', 'post-expirator'); ?></label>
                </th>
                <td>
                    <select name="expired-default-date-<?php
                    echo $type; ?>"
                            id="expired-default-date-<?php
                            echo $type; ?>" class="pe-custom-date-toggle">
                        <?php
                        foreach ($values as $value => $label) { ?>
                            <option value="<?php
                            echo $value; ?>" <?php
                            selected($value, $defaults['default-expire-type']); ?>><?php
                                echo $label; ?></option>
                            <?php
                        } ?>
                    </select>
                    <p class="description"><?php
                        _e('Set the default expiration date to be used when creating a new post of this type.'); ?></p>
                    <div id="expired-custom-container-<?php
                    echo $type; ?>" class="pe-custom-date-container"
                         style="display: <?php
                         echo $show; ?>;">
                        <br/>
                        <label for="expired-custom-date-<?php
                        echo $type; ?>"><?php
                            _e('Custom', 'post-expirator'); ?>
                            :</label>
                        <input type="text" value="<?php
                        echo $customDate; ?>"
                               name="expired-custom-date-<?php
                               echo $type; ?>"
                               id="expired-custom-date-<?php
                               echo $type; ?>"/>
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
        </table>
        </fieldset>
        <?php
    }
    ?>
    <p class="submit">
        <input type="submit" name="expirationdateSaveDefaults" class="button-primary"
               value="<?php
               _e('Save Changes', 'post-expirator'); ?>"/>
    </p>
</form>
