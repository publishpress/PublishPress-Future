<?php

$defaults = PostExpirator_Facade::get_default_expiry($post_type);

$year = $defaults['year'];
$month = $defaults['month'];
$day = $defaults['day'];
$hour = $defaults['hour'];
$minute = $defaults['minute'];
?>
<div style="clear:both"></div>
<div class="inline-edit-col post-expirator-quickedit">
    <div class="inline-edit-col">
        <div class="inline-edit-group">
            <legend class="inline-edit-legend"><?php
                _e('Post Expirator', 'post-expirator'); ?></legend>
            <fieldset class="inline-edit-date">
                <div class="pe-qe-fields">
                    <div>
                        <legend><span class="title"><?php
                                _e('Date', 'post-expirator'); ?></span></legend>
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Enable Post Expiration', 'post-expirator'); ?></span>
                            <select name="expirationdate_status">
                                <option value="no-change" data-show-fields="false" selected>
                                    --<?php
                                    _e('No Change', 'post-expirator'); ?>--
                                </option>
                                <option value="change-only" data-show-fields="true"
                                        title="<?php
                                        _e('Change expiry date if enabled on posts', 'post-expirator'); ?>"><?php
                                    _e('Change on posts', 'post-expirator'); ?></option>
                                <option value="add-only" data-show-fields="true"
                                        title="<?php
                                        _e('Add expiry date if not enabled on posts', 'post-expirator'); ?>"><?php
                                    _e('Add to posts', 'post-expirator'); ?></option>
                                <option value="change-add"
                                        data-show-fields="true"><?php
                                    _e('Change & Add', 'post-expirator'); ?></option>
                                <option value="remove-only"
                                        data-show-fields="false"><?php
                                    _e('Remove from posts', 'post-expirator'); ?></option>
                            </select>
                        </label>
                        <span class="post-expirator-date-fields">
                            <label>
                                <span class="screen-reader-text"><?php
                                    _e('Month', 'post-expirator'); ?></span>
                                <select name="expirationdate_month">
                            <?php
                            for ($x = 1; $x <= 12; $x++) {
                                $now = mktime(0, 0, 0, $x, 1, date_i18n('Y'));
                                $monthNumeric = date_i18n('m', $now);
                                $monthStr = date_i18n('M', $now);
                                // phpcs:ignore WordPress.PHP.StrictComparisons.LooseComparison
                                $selected = $monthNumeric == $defaults['month'] ? 'selected' : '';
                                ?>
                                <option value="<?php
                                echo $monthNumeric; ?>"
                                        data-text="<?php
                                        echo $monthStr; ?>" <?php
                                echo $selected; ?>><?php
                                    echo $monthNumeric; ?>-<?php
                                    echo $monthStr; ?></option>
                                <?php
                            } ?>

                                </select>
                            </label>
                            <label>
                                <span class="screen-reader-text"><?php
                                    _e('Day', 'post-expirator'); ?></span>
                                <input name="expirationdate_day" placeholder="<?php
                                echo $day; ?>" value="" size="2"
                                       maxlength="2" autocomplete="off" type="text">
                            </label>,
                            <label>
                                <span class="screen-reader-text"><?php
                                    _e('Year', 'post-expirator'); ?></span>
                                <input name="expirationdate_year" placeholder="<?php
                                echo $year; ?>" value="" size="4"
                                       maxlength="4" autocomplete="off" type="text">
                            </label> @
                            <label>
                                <span class="screen-reader-text"><?php
                                    _e('Hour', 'post-expirator'); ?></span>
                                <input name="expirationdate_hour" placeholder="<?php
                                echo $hour; ?>" value="" size="2"
                                       maxlength="2" autocomplete="off" type="text">
                            </label> :
                            <label>
                                <span class="screen-reader-text"><?php
                                    _e('Minute', 'post-expirator'); ?></span>
                                <input name="expirationdate_minute" placeholder="<?php
                                echo $minute; ?>" value=""
                                       size="2" maxlength="2" autocomplete="off" type="text">
                            </label>
                        </span>
                    </div>
                    <div class="post-expirator-date-fields">
                        <legend>
                            <span class="title"><?php
                                _e('Type', 'post-expirator'); ?></span>
                            <span class="screen-reader-text"><?php
                                _e('How to expire', 'post-expirator'); ?></span>
                        </legend>
                        <label>
                            <?php
                            $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));
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
                                echo $tax_label; ?></span>
                            <span class="screen-reader-text"><?php
                                _e('Expiration Categories', 'post-expirator'); ?></span>
                        </legend>
                        <ul id="categorychecklist"
                            class="list:category categorychecklist cat-checklist category-checklist">
                            <?php
                            if (! empty($taxonomy)) {
                                $walker = new Walker_PostExpirator_Category_Checklist();
                                wp_terms_checklist(0, array(
                                    'taxonomy' => $taxonomy,
                                    'walker' => $walker,
                                    'checked_ontop' => false
                                ));
                            }
                            ?>
                        </ul>
                    </div>
                    </span>
                </div>
                <input name="expirationdate_quickedit" value="true" type="hidden"/>
                <input name="postexpirator_view" value="bulk-edit" type="hidden"/>
            </fieldset>
        </div>
    </div>
</div>
