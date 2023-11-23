<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;
use PublishPress\Future\Modules\Expirator\PostMetaAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
?>
<div class="post-expire-col" data-id="<?php echo esc_attr($id); ?>"
     data-expire-attributes="<?php echo esc_attr(wp_json_encode($attributes)); ?>">
    <?php
    $iconClass = '';
    $iconTitle = '';

    $container = Container::getInstance();
    $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
    $postModel = $factory($id);

    $expirationEnabled = $postModel->isExpirationEnabled();
    $expirationDate = $postModel->getExpirationDateAsUnixTime();

    if ($expirationEnabled) {
        $format = get_option('date_format') . ' ' . get_option('time_format');
        $action = $postModel->getExpirationAction();

        if (is_object($action)) {
            ?><span class="dashicons dashicons-clock icon-scheduled" aria-hidden="true"></span> <?php

            if ($column_style === 'simple') {
                echo esc_html(PostExpirator_Util::get_wp_date($format, $expirationDate));
            } else {
                echo sprintf(
                    esc_html__('%1$s%2$s%3$s on %5$s%4$s%6$s', 'post-expirator'),
                    '<span class="future-action-action-name">',
                    esc_html($action->getDynamicLabel()),
                    '</span>',
                    esc_html(PostExpirator_Util::get_wp_date($format, $expirationDate)),
                    '<span class="future-action-action-date">',
                    '</span>'
                );

                $categoryActions = [
                    ExpirationActionsAbstract::POST_CATEGORY_ADD,
                    ExpirationActionsAbstract::POST_CATEGORY_SET,
                    ExpirationActionsAbstract::POST_CATEGORY_REMOVE,
                ];

                if (in_array($action, $categoryActions)) {
                    $terms = $postModel->getExpirationCategoryNames();
                    if (!empty($terms)) {
                        ?>
                        <div class="future-action-gray">[<?php echo esc_html(implode(', ', $terms)); ?>]</div>
                        <?php
                    }
                }
            }

        } else {
            ?><span class="dashicons dashicons-warning icon-missed" aria-hidden="true"></span> <?php
            echo esc_html__('Action could not be scheduled due to a configuration issue. Please attempt to schedule it again.', 'post-expirator');
        }
    } else {
        ?>
        <span aria-hidden="true">—</span>
        <span class="screen-reader-text"><?php echo esc_html__('No future action', 'post-expirator'); ?></span>
        <?php
    }

    $defaultDataModelFactory = $container->get(ServicesAbstract::POST_TYPE_DEFAULT_DATA_MODEL_FACTORY);
    $defaultDataModel = $defaultDataModelFactory->create($post_type);

    $expireType = $defaultDataModel->getAction();

    $defaultDateParts = $defaultDataModel->getActionDateParts();

    $defaultYear = $defaultDateParts['year'];
    $defaultMonth = $defaultDateParts['month'];
    $defaultDay = $defaultDateParts['day'];
    $defaultHour = $defaultDateParts['hour'];
    $defaultMinute = $defaultDateParts['minute'];
    $enabled = $expirationEnabled ? 'true' : 'false';
    $terms = '';

    // Values for Quick Edit.
    if ($expirationEnabled) {
        $date = gmdate('Y-m-d H:i:s', $expirationDate);
        $defaultYear = get_date_from_gmt($date, 'Y');
        $defaultMonth = get_date_from_gmt($date, 'm');
        $defaultDay = get_date_from_gmt($date, 'd');
        $defaultHour = get_date_from_gmt($date, 'H');
        $defaultMinute = get_date_from_gmt($date, 'i');
        if (isset($attributes['expireType'])) {
            $expireType = $attributes['expireType'];
        }
        if (
            isset($attributes['category'])
            && ! empty($attributes['category']) && in_array($expireType, array(
                'category',
                'category-add',
                'category-remove'
            ), true)) {
            $terms = implode(',', $attributes['category']);

            if (empty($terms)) {
                $terms = $defaultDataModel->getTermsAsString();
            }
        }
    }

    // The hidden fields will be used by quick edit.
    ?>

    <input type="hidden" id="expirationdate_year-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultYear); ?>" />
    <input type="hidden" id="expirationdate_month-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultMonth); ?>" />
    <input type="hidden" id="expirationdate_day-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultDay); ?>" />
    <input type="hidden" id="expirationdate_hour-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultHour); ?>" />
    <input type="hidden" id="expirationdate_minute-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultMinute); ?>" />
    <input type="hidden" id="expirationdate_enabled-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($enabled); ?>" />
    <input type="hidden" id="expirationdate_expireType-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($expireType); ?>" />
    <input type="hidden" id="expirationdate_categories-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($terms); ?>" />
</div>
