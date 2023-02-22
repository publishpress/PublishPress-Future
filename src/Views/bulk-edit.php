<?php

defined('ABSPATH') or die('Direct access not allowed.');

$defaults = PostExpirator_Facade::get_default_expiry($post_type);

$defaultYear = $defaults['year'];
$defaultMonth = $defaults['month'];
$defaultDay = $defaults['day'];
$defaultHour = $defaults['hour'];
$defaultMinute = $defaults['minute'];

$container = \PublishPressFuture\Core\DI\Container::getInstance();
$settingsFacade = $container->get(\PublishPressFuture\Core\DI\ServicesAbstract::SETTINGS);

$defaults = $settingsFacade->getPostTypeDefaults($post_type);
?>
<div style="clear:both"></div>
<div class="inline-edit-col post-expirator-quickedit">
    <div class="inline-edit-col">
        <div class="inline-edit-group">
            <legend class="inline-edit-legend"><?php
                esc_html_e('PublishPress Future', 'post-expirator'); ?></legend>
            <fieldset class="inline-edit-date">
                <div class="pe-qe-fields">
                    <div>
                        <legend><span class="title"><?php
                                esc_html_e('Date', 'post-expirator'); ?></span></legend>
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Enable Post Expiration', 'post-expirator'); ?></span>
                            <select name="expirationdate_status">
                                <option value="no-change" data-show-fields="false" selected>
                                    --<?php
                                    esc_html_e('No Change', 'post-expirator'); ?>--
                                </option>
                                <option value="change-only" data-show-fields="true"
                                        title="<?php
                                        esc_attr_e('Change expiry date if enabled on p  osts', 'post-expirator'); ?>"><?php
                                    esc_html_e('Change on posts', 'post-expirator'); ?></option>
                                <option value="add-only" data-show-fields="true"
                                        title="<?php
                                        esc_attr_e('Add expiry date if not enabled on posts', 'post-expirator'); ?>"><?php
                                    esc_html_e('Add to posts', 'post-expirator'); ?></option>
                                <option value="change-add"

                                        data-show-fields="true"><?php
                                    esc_html_e('Change & Add', 'post-expirator'); ?></option>
                                <option value="remove-only"
                                        data-show-fields="false"><?php
                                    esc_html_e('Remove from posts', 'post-expirator'); ?></option>
                            </select>
                        </label>
                        <span class="post-expirator-date-fields">
                            <label>
                                <span class="screen-reader-text"><?php
                                    esc_html_e('Month', 'post-expirator'); ?></span>
                                <select name="expirationdate_month">
                            <?php
                            for ($x = 1; $x <= 12; $x++) {
                                $now = mktime(0, 0, 0, $x, 1, date_i18n('Y'));
                                $monthNumeric = PostExpirator_Util::get_wp_date('m', $now);
                                $monthStr = PostExpirator_Util::get_wp_date('M', $now);
                                // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
                                $selected = $monthNumeric == $defaultMonth ? 'selected' : '';
                                ?>
                                <option value="<?php
                                echo esc_attr($monthNumeric); ?>"
                                        data-text="<?php
                                        echo esc_attr($monthStr); ?>" <?php
                                echo esc_attr($selected); ?>><?php
                                    echo esc_html($monthNumeric); ?>-<?php
                                    echo esc_html($monthStr); ?></option>
                                <?php
                            } ?>

                                </select>
                            </label>
                            <label>
                                <span class="screen-reader-text"><?php
                                    esc_html_e('Day', 'post-expirator'); ?></span>
                                <input name="expirationdate_day" required value="<?php
                                echo esc_attr($defaultDay); ?>" size="2"
                                       maxlength="2" autocomplete="off" type="text">
                            </label>,
                            <label>
                                <span class="screen-reader-text"><?php
                                    esc_html_e('Year', 'post-expirator'); ?></span>
                                <input name="expirationdate_year" required value="<?php
                                echo esc_attr($defaultYear); ?>" size="4"
                                       maxlength="4" autocomplete="off" type="text">
                            </label> @
                            <label>
                                <span class="screen-reader-text"><?php
                                    esc_html_e('Hour', 'post-expirator'); ?></span>
                                <input name="expirationdate_hour" required value="<?php
                                echo esc_attr($defaultHour); ?>" size="2"
                                       mdefaultMxlength="2" autocomplete="off" type="text">
                            </label> :
                            <label>
                                <span class="screen-reader-text"><?php
                                    esc_html_e('Minute', 'post-expirator'); ?></span>
                                <input name="expirationdate_minute" required value="<?php
                                echo esc_attr($defaultMinute); ?>" size="2" maxlength="2" autocomplete="off" type="text">
                            </label>

                            <?php
                            echo esc_html(PostExpirator_Util::wp_timezone_string()); ?>
                        </span>
                    </div>
                    <div class="post-expirator-date-fields">
                        <legend>
                            <span class="title"><?php
                                esc_html_e('Type', 'post-expirator'); ?></span>
                            <span class="screen-reader-text"><?php
                                esc_html_e('How to expire', 'post-expirator'); ?></span>
                        </legend>
                        <label>
                            <?php
                            _postexpirator_expire_type(array(
                                'name' => 'expirationdate_expiretype',
                                'selected' => empty($defaults) ? 'draft' : $defaults['expireType'],
                                'post_type' => $post_type
                            ));
                            ?>
                        </label>
                    </div>
                    <div class="pe-category-list">
                        <legend>
                            <span class="title"><?php
                                echo esc_html($tax_label); ?></span>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Expiration Taxonomies', 'post-expirator'); ?></span>
                        </legend>
                        <ul id="categorychecklist"
                            class="list:category categorychecklist cat-checklist category-checklist">
                            <?php
                            if (! empty($taxonomy)) {
                                $walker = new Walker_PostExpirator_Category_Checklist();
                                wp_terms_checklist(0, array(
                                    'taxonomy' => $taxonomy,
                                    'walker' => $walker,
                                    'checked_ontop' => false,
                                    'selected_cats' => isset($defaults['terms']) ? (array)$defaults['terms'] : []
                                ));
                            }
                            ?>
                        </ul>
                    </div>
                </div>
                <input name="expirationdate_quickedit" value="true" type="hidden"/>
                <input name="postexpirator_view" value="bulk-edit" type="hidden"/>
            </fieldset>
        </div>
    </div>
</div>
