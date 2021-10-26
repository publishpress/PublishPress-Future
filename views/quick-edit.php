<div style="clear:both"></div>
<fieldset class="inline-edit-col-left post-expirator-quickedit">
    <div class="inline-edit-col">
        <div class="inline-edit-group">
            <label>
                <input name="enable-expirationdate" type="checkbox"/>
                <span class=""><?php
                    _e('Enable Post Expiration', 'post-expirator'); ?></span>
            </label>
            <fieldset class="inline-edit-date">
                <div class="pe-qe-fields" style="display: none">
                    <div>
                        <legend><span class="title"><?php
                                _e('Date', 'post-expirator'); ?></span></legend>
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Month', 'post-expirator'); ?></span>
                            <select name="expirationdate_month">
                                <?php
                                for ($x = 1; $x <= 12; $x++) {
                                    $now = mktime(0, 0, 0, $x, 1, date_i18n('Y'));
                                    $monthNumeric = date_i18n('m', $now);
                                    $monthStr = date_i18n('M', $now);
                                    ?>
                                    <option value="<?php
                                    echo $monthNumeric; ?>"
                                            data-text="<?php
                                            echo $monthStr; ?>"><?php
                                        echo $monthNumeric; ?>
                                        -<?php
                                        echo $monthStr; ?></option>
                                    <?php
                                } ?>

                            </select>
                        </label>
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Day', 'post-expirator'); ?></span>
                            <input name="expirationdate_day" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="<?php
                            echo date('d'); ?>">
                        </label>,
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Year', 'post-expirator'); ?></span>
                            <input name="expirationdate_year" value="" size="4" maxlength="4" autocomplete="off"
                                   type="text" placeholder="<?php
                            echo date('Y'); ?>">
                        </label> @
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Hour', 'post-expirator'); ?></span>
                            <input name="expirationdate_hour" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="00">
                        </label> :
                        <label>
                            <span class="screen-reader-text"><?php
                                _e('Minute', 'post-expirator'); ?></span>
                            <input name="expirationdate_minute" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="00">
                        </label>
                    </div>
                    <div>
                        <legend>
                            <span class="title"><?php
                                _e('Type', 'post-expirator'); ?></span>
                            <span class="screen-reader-text"><?php
                                _e('How to expire', 'post-expirator'); ?></span>
                        </legend>
                        <?php
                        $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));
                        _postexpirator_expire_type(array(
                            'name' => 'expirationdate_expiretype',
                            'selected' => empty($defaults) ? 'draft' : $defaults['expireType'],
                            'post_type' => $post_type
                        ));
                        ?>
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

                </div>
                <input name="expirationdate_quickedit" value="true" type="hidden"/>
                <input name="postexpirator_view" value="quick-edit" type="hidden"/>
            </fieldset>
        </div>
    </div>
</fieldset>
