<?php
defined('ABSPATH') or die('Direct access not allowed.');
?>
<div id="publishpress-future-classic-metabox"></div>


<hr/>





<p>
    <input
        type="checkbox"
        name="enable-expirationdate"
        id="enable-expirationdate"
        value="checked"
        <?php echo $enabled ? ' checked=checked' : ''; ?> />
    <label for="enable-expirationdate">
        <?php esc_html_e('Enable Future Action', 'post-expirator'); ?>
    </label>
</p>

    <p>
        <input type="checkbox" name="enable-expirationdate" id="enable-expirationdate" value="checked"
            <?php
            $currentYear = date('Y');

            if ($defaultYear < $currentYear) {
                $currentYear = $defaultYear;
            }

            for ($i = $currentYear; $i <= $currentYear + 10; $i++) {
                ?>
                <option
                    <?php echo $i === $defaultYear ? ' selected="selected"' : ''; ?>
                    value="<?php echo esc_attr($i); ?>">
                    <?php echo esc_html($i); ?>
                </option>
                <?php
            }
            ?>
        </select>
    </div>
    <div>
        <label><?php esc_html_e('Month', 'post-expirator'); ?></label>
        <select name="expirationdate_month" id="expirationdate_month">
            <?php
            for ($i = 1; $i <= 12; $i++) {
                ?>
                <option
                    value="<?php esc_attr_e($i); ?>"
                    <?php echo $i === $defaultMonth ? ' selected="selected"' : ''; ?>>
                    <?php echo esc_html(date_i18n('F', mktime(0, 0, 0, $i, 1, date_i18n('Y')))); ?>
                </option>
                <?php
            }
            ?>
        </select>
    </div>
    <div>
        <label><?php esc_html_e('Day', 'post-expirator'); ?></label>
        <select name="expirationdate_day" id="expirationdate_day">
            <?php
            for ($i = 1; $i <= 31; $i++) {
                ?>
                <option
                    value="<?php echo esc_attr($i); ?>"
                    <?php echo $defaultDay === $i ? ' selected="selected"' : ''; ?>>
                    <?php echo str_pad($i, 2, '0', STR_PAD_LEFT); ?>
                </option>
                <?php
            }
            ?>
        </select>
    </div>
    <div>
        <label><?php esc_html_e('Hour', 'post-expirator'); ?>
            (<?php echo esc_html(date_i18n('T', mktime(0, 0, 0, $i, 1, date_i18n('Y')))); ?>)</label>
        <select name="expirationdate_hour" id="expirationdate_hour">
            <?php
            for ($i = 1; $i <= 24; $i++) {
                ?>
                <option
                    value="<?php echo esc_attr($i); ?>"
                    <?php echo $defaultHour === $i ? ' selected="selected"' : ''; ?>>
                    <?php echo str_pad($i, 2, '0', STR_PAD_LEFT); ?>
                </option>
                <?php
            }
            ?>
        </select>
    </div>
    <div>
        <label><?php esc_html_e('Minute', 'post-expirator'); ?></label>
        <select name="expirationdate_minute" id="expirationdate_minute">
            <?php
            for ($i = 0; $i <= 59; $i++) {
                ?>
                <option
                    value="<?php echo esc_attr($i); ?>"
                    <?php echo $defaultMinute === $i ? ' selected="selected"' : ''; ?>>
                    <?php echo str_pad($i, 2, '0', STR_PAD_LEFT); ?>
                </option>
                <?php
            }
            ?>
        </select>
    </div>
    <div>
        <label><?php esc_html_e('Action', 'post-expirator'); ?></label>
        <?php
        _postexpirator_expire_type(
            [
                'type' => $post->post_type,
                'name' => 'expirationdate_expiretype',
                'selected' => $expireType
            ]
        );
        ?>
    </div>

    <?php
    $termRelatedActions = ['category', 'category-add', 'category-remove'];
    $actionIsRelatedToTerms = isset($expireType) && in_array($expireType, $termRelatedActions);
    $catDisplay = $actionIsRelatedToTerms ? 'block' : 'none';

    $termChecklistWalker = new Walker_PostExpirator_Category_Checklist();
    $hierarchicalTaxonomies = wp_filter_object_list(
        get_object_taxonomies($post->post_type, 'object'),
        ['hierarchical' => true]
    );
    ?>
    <div id="expired-category-wrapper">
        <?php if (empty($hierarchicalTaxonomies)) : ?>
            <p><?php esc_html_e('You must assign a hierarchical taxonomy to this post type to use this feature.', 'post-expirator'); ?></p>
        <?php elseif (count($hierarchicalTaxonomies) > 1 && !isset($defaultsOption['taxonomy'])) : ?>
            <p><?php esc_html_e(
                'More than 1 hierarchical taxonomy detected.  You must assign a default taxonomy on the settings screen.',
                'post-expirator'
            ); ?></p>
        <?php else : ?>
            <?php
            $keys = array_keys($hierarchicalTaxonomies);

            if (empty($hierarchicalTaxonomies)) {
                $keys = ['category'];
            }

            $taxonomyId = isset($defaultsOption['taxonomy']) ? $defaultsOption['taxonomy'] : $keys[0];
            ?>
            <div id="expired-category-selection" style="display: <?php esc_attr_e($catDisplay); ?>">
                <br/>

                <?php if (isset($taxonomyId)) : ?>
                    <?php $taxonomyObj = get_taxonomy($taxonomyId); ?>
                    <label><?php esc_html_e($taxonomyObj->label); ?></label><br/>
                <?php endif; ?>

                <div class="wp-tab-panel" id="post-expirator-cat-list">
                    <ul id="categorychecklist" class="list:category categorychecklist form-no-clear">

                        <?php
                        if (!is_array($terms) || empty($terms)) {
                            $terms = [];
                        }

                        if (empty($terms) && isset($defaultsOption['terms'])) {
                            $terms = explode(',', $defaultsOption['terms']);
                            $terms = array_map('intval', $terms);
                        }

                        wp_terms_checklist(
                            0,
                            [
                                'taxonomy' => $taxonomyId,
                                'walker' => $termChecklistWalker,
                                'selected_cats' => $terms,
                                'checked_ontop' => false
                            ]
                        );
                        ?>

                        <input type="hidden" name="taxonomy-hierarchical" value="' . esc_attr($taxonomyId) . '" />
                    </ul>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<input name="expirationdate_formcheck" value="true" type="hidden" />
<input name="postexpirator_view" value="classic-metabox" type="hidden" />
<?php
wp_nonce_field('__postexpirator', '_postexpiratornonce');
