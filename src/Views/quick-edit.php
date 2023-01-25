<?php

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
?>

<div style="clear:both"></div>
<fieldset class="inline-edit-col-left post-expirator-quickedit">
    <div class="inline-edit-col">
        <div class="inline-edit-group">
            <label>
                <input name="enable-expirationdate" type="checkbox"/>
                <span class=""><?php
                    esc_html_e('Enable Post Expiration', 'post-expirator'); ?></span>
            </label>
            <fieldset class="inline-edit-date">
                <div class="pe-qe-fields" style="display: none">
                    <div>
                        <legend><span class="title"><?php
                                esc_html_e('Date', 'post-expirator'); ?></span></legend>
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Month', 'post-expirator'); ?></span>
                            <select name="expirationdate_month">
                                <?php
                                for ($x = 1; $x <= 12; $x++) {
                                    $now = mktime(0, 0, 0, $x, 1, date_i18n('Y'));
                                    $monthNumeric = date_i18n('m', $now);
                                    $monthStr = date_i18n('M', $now);
                                    ?>
                                    <option value="<?php
                                    echo esc_attr($monthNumeric); ?>"
                                            data-text="<?php
                                            echo esc_attr($monthStr); ?>"><?php
                                        echo esc_html($monthNumeric); ?>
                                        -<?php
                                        echo esc_html($monthStr); ?></option>
                                    <?php
                                } ?>

                            </select>
                        </label>
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Day', 'post-expirator'); ?></span>
                            <input name="expirationdate_day" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="<?php
                            echo esc_attr(date('d')); ?>">
                        </label>,
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Year', 'post-expirator'); ?></span>
                            <input name="expirationdate_year" value="" size="4" maxlength="4" autocomplete="off"
                                   type="text" placeholder="<?php
                            echo esc_attr(date('Y')); ?>">
                        </label> @
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Hour', 'post-expirator'); ?></span>
                            <input name="expirationdate_hour" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="00">
                        </label> :
                        <label>
                            <span class="screen-reader-text"><?php
                                esc_html_e('Minute', 'post-expirator'); ?></span>
                            <input name="expirationdate_minute" value="" size="2" maxlength="2" autocomplete="off"
                                   type="text" placeholder="00">
                        </label>

                        <?php
                        echo esc_html(PostExpirator_Util::wp_timezone_string()); ?>
                    </div>
                    <div>
                        <legend>
                            <span class="title"><?php
                                esc_html_e('Type', 'post-expirator'); ?></span>
                            <span class="screen-reader-text"><?php
                                esc_html_e('How to expire', 'post-expirator'); ?></span>
                        </legend>
                        <?php
                        $container = Container::getInstance();
                        $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

                        $defaults = $settingsFacade->getPostTypeDefaults($post_type);

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
                                    'checked_ontop' => false
                                ));
                            }
                            ?>
                        </ul>
                    </div>

                </div>
                <input name="expirationdate_quickedit" value="true" type="hidden"/>
                <input name="postexpirator_view" value="quick-edit" type="hidden"/>
                <?php wp_nonce_field('__postexpirator', '_postexpiratornonce'); ?>
            </fieldset>
        </div>
    </div>
</fieldset>
