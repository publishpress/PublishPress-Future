<?php

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

$container = Container::getInstance();
$defaultDataModel = $container->get(ServicesAbstract::DEFAULT_DATA_MODEL);

$defaults = $defaultDataModel->getDefaultExpirationDateForPostType($post_type);

$defaultYear = $defaults['year'];
$defaultMonth = $defaults['month'];
$defaultDay = $defaults['day'];
$defaultHour = $defaults['hour'];
$defaultMinute = $defaults['minute'];

$settingsFacade = $container->get(ServicesAbstract::SETTINGS);

$defaults = $settingsFacade->getPostTypeDefaults($post_type);

$postTypeObject = get_post_type_object($post_type);
?>
<div style="clear:both"></div>
<div class="inline-edit-col post-expirator-quickedit">
    <div class="inline-edit-col">
        <div class="inline-edit-group">
            <legend class="inline-edit-legend"><?php
                esc_html_e('Future Action', 'post-expirator'); ?></legend>
            <fieldset class="inline-edit-date">
                <div class="pe-qe-fields">
                    <div>
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Enable Future Action', 'post-expirator'); ?></span>
                            <select name="expirationdate_status">
                                <option value="no-change" data-show-fields="false" selected>— <?php
                                    esc_html_e('No Change', 'post-expirator'); ?> —</option>

                                <option value="change-add"
                                        data-show-fields="true"><?php echo esc_html(sprintf(
                                            __('Add or update action for %s', 'post-expirator'),
                                            strtolower($postTypeObject->labels->name)
                                        )); ?></option>
                                <option
                                    value="add-only"
                                    data-show-fields="true"><?php echo esc_html(sprintf(
                                            __('Add action if none exists for %s', 'post-expirator'),
                                            strtolower($postTypeObject->labels->name)
                                        )); ?></option>
                                <option
                                    value="change-only"
                                    data-show-fields="true"><?php echo esc_html(sprintf(
                                            __('Update the existing actions for %s', 'post-expirator'),
                                            strtolower($postTypeObject->labels->name)
                                        )); ?></option>
                                <option value="remove-only"
                                        data-show-fields="false"><?php echo esc_html(sprintf(
                                            __('Remove action from %s', 'post-expirator'),
                                            strtolower($postTypeObject->labels->name)
                                        )); ?></option>
                            </select>
                        </label><br /><br />

                        <span class="post-expirator-date-fields">
                            <legend><span class="title"><?php
                                esc_html_e('Date', 'post-expirator'); ?></span></legend>

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
                                esc_html_e('Action', 'post-expirator'); ?></span>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Action', 'post-expirator'); ?></span>
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
                                esc_html_e('Terms', 'post-expirator'); ?></span>
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
