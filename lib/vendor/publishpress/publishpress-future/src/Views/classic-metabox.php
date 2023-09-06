<?php
defined('ABSPATH') or die('Direct access not allowed.');
?>

    <p>
        <input type="checkbox" name="enable-expirationdate" id="enable-expirationdate" value="checked"
            <?php
            // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
            echo $enabled; ?>/>
        <label for="enable-expirationdate"><?php
            esc_html_e('Enable Future Action', 'post-expirator'); ?></label>
    </p>

<?php
if ($default === 'publish') {
    ?>
    <em><?php
        esc_html_e('The published date/time will be used as the expiration value', 'post-expirator'); ?></em>
    <?php
    return;
}
?>
    <div class="pe-classic-fields" style="display: <?php
    echo empty($enabled) ? 'none' : 'flex'; ?>">
        <div>
            <label><?php
                esc_html_e('Year', 'post-expirator'); ?></label>
            <select name="expirationdate_year" id="expirationdate_year">
                <?php
                $currentyear = date('Y');

                if ($defaultyear < $currentyear) {
                    $currentyear = $defaultyear;
                }

                for ($i = $currentyear; $i <= $currentyear + 10; $i++) {
                    // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
                    if ($i == $defaultyear) {
                        $selected = ' selected="selected"';
                    } else {
                        $selected = '';
                    }
                    ?>
                    <option <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $selected; ?> value="<?php
                    echo esc_attr($i); ?>"><?php
                        echo esc_html($i); ?></option>
                    <?php
                }
                ?>
            </select>
        </div>
        <div>
            <label><?php
                esc_html_e('Month', 'post-expirator'); ?></label>
            <select name="expirationdate_month" id="expirationdate_month">
                <?php
                for ($i = 1; $i <= 12; $i++) {
                    if ($defaultmonth === date_i18n('m', mktime(0, 0, 0, $i, 1, date_i18n('Y')))) {
                        $selected = ' selected="selected"';
                    } else {
                        $selected = '';
                    }
                    ?>
                    <option value="<?php
                    echo esc_attr(date_i18n('m', mktime(0, 0, 0, $i, 1, date_i18n('Y')))); ?>" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $selected; ?>><?php
                        echo esc_html(date_i18n('F', mktime(0, 0, 0, $i, 1, date_i18n('Y')))); ?></option>
                    <?php
                }
                ?>
            </select>
        </div>
        <div>
            <label><?php
                esc_html_e('Day', 'post-expirator'); ?></label>
            <input type="text" id="expirationdate_day" name="expirationdate_day" value="<?php
            echo esc_attr($defaultday); ?>"
                   size="2"/>
        </div>
        <div>
            <label><?php
                esc_html_e('Hour', 'post-expirator'); ?>
                (<?php
                echo esc_html(date_i18n('T', mktime(0, 0, 0, $i, 1, date_i18n('Y')))); ?>)</label>
            <select name="expirationdate_hour" id="expirationdate_hour">
                <?php
                for ($i = 1; $i <= 24; $i++) {
                    $hour = date_i18n('H', mktime($i, 0, 0, date_i18n('n'), date_i18n('j'), date_i18n('Y')));
                    if ($defaulthour === $hour) {
                        $selected = ' selected="selected"';
                    } else {
                        $selected = '';
                    }
                    ?>
                    <option value="<?php
                    echo esc_attr($hour); ?>" <?php
                    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                    echo $selected; ?>><?php
                        echo esc_html($hour); ?></option>
                    <?php
                }
                ?>
            </select>
        </div>
        <div>
            <label><?php
                esc_html_e('Minute', 'post-expirator'); ?></label>
            <input type="text" id="expirationdate_minute" name="expirationdate_minute" value="<?php
            echo esc_attr($defaultminute); ?>"
                   size="2"/>
        </div>
        <div>
            <label><?php
                esc_html_e('Action', 'post-expirator'); ?></label>
            <?php
            _postexpirator_expire_type(array(
                'type' => $post->post_type,
                'name' => 'expirationdate_expiretype',
                'selected' => $expireType
            )); ?>
        </div>

        <?php
        if (isset($expireType) && ($expireType === 'category' || $expireType === 'category-add' || $expireType === 'category-remove')) {
            $catdisplay = 'block';
        } else {
            $catdisplay = 'none';
        }

        $walker = new Walker_PostExpirator_Category_Checklist();
        $taxonomies = get_object_taxonomies($post->post_type, 'object');
        $taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));

        ?><div id="expired-category-wrapper">
            <?php
            if (empty($taxonomies)) {
                echo '<p>' . esc_html__(
                        'You must assign a hierarchical taxonomy to this post type to use this feature.',
                        'post-expirator'
                    ) . '</p>';
            } elseif (count($taxonomies) > 1 && ! isset($defaultsOption['taxonomy'])) {
                echo '<p>' . esc_html__(
                        'More than 1 hierarchical taxonomy detected.  You must assign a default taxonomy on the settings screen.',
                        'post-expirator'
                    ) . '</p>';
            } else {
                $keys = array_keys($taxonomies);

                if (! empty($taxonomies)) {
                    $keys = array('category');
                }

                $taxonomyId = isset($defaultsOption['taxonomy']) ? $defaultsOption['taxonomy'] : $keys[0];

                echo '<div id="expired-category-selection" style="display: ' . esc_attr($catdisplay) . '">';

                echo '<br/>';

                if (isset($taxonomyId)) {
                    $taxonomyObj = get_taxonomy($taxonomyId);
                    echo '<label>' . esc_html($taxonomyObj->label) . '</label><br/>';
                }

                echo '<div class="wp-tab-panel" id="post-expirator-cat-list">';
                echo '<ul id="categorychecklist" class="list:category categorychecklist form-no-clear">';


                if (! is_array($categories) || empty($categories)) {
                    $categories = [];
                }

                if (empty($categories) && isset($defaultsOption['terms'])) {
                    $categories = explode(',', $defaultsOption['terms']);
                    $categories = array_map('intval', $categories);
                }

                wp_terms_checklist(0, array(
                    'taxonomy' => $taxonomyId,
                    'walker' => $walker,
                    'selected_cats' => $categories,
                    'checked_ontop' => false
                ));
                echo '<input type="hidden" name="taxonomy-hierarchical" value="' . esc_attr($taxonomyId) . '" />';

                echo '</ul>';
                echo '</div>';
                echo '</div>';
            }
            ?>
        </div>
    </div>

    <input name="expirationdate_formcheck" value="true" type="hidden"/>
    <input name="postexpirator_view" value="classic-metabox" type="hidden"/>
<?php
wp_nonce_field('__postexpirator', '_postexpiratornonce');
