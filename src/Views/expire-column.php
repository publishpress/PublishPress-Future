<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

use PublishPressFuture\Core\DI\Container;
use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Modules\Expirator\PostMetaAbstract;

defined('ABSPATH') or die('Direct access not allowed.');
?>
<div class="post-expire-col" data-id="<?php echo esc_attr($id); ?>"
     data-expire-attributes="<?php echo esc_attr(wp_json_encode($attributes)); ?>">
    <?php
    $iconClass = '';
    $iconTitle = '';

    $container = Container::getInstance();
    $postModel = ($container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY))($id);

    $expirationEnabled = $postModel->isExpirationEnabled();
    $expirationDate = $postModel->getExpirationDate();

    if ($expirationDate && $expirationEnabled) {
        $format = get_option('date_format') . ' ' . get_option('time_format');
        $display = PostExpirator_Util::get_wp_date($format, $expirationDate);

        $iconClass = 'clock icon-scheduled';
        $iconTitle = __('Cron event scheduled.', 'post-expirator');
    } else {
        $display = __('Never', 'post-expirator');
        $iconClass = 'marker icon-never';
    }

    $settingsFacade = $container->get(ServicesAbstract::SETTINGS);

    $defaultsForPostType = $settingsFacade->getPostTypeDefaults($post_type);
    $expireType = 'draft';
    if (isset($defaultsForPostType['expireType'])) {
        $expireType = $defaultsForPostType['expireType'];
    }

    // these defaults will be used by quick edit
    $defaultDataModel = $container->get(ServicesAbstract::DEFAULT_DATA_MODEL);

    $defaults = $defaultDataModel->getDefaultExpirationDateForPostType($post_type);

    $defaultYear = $defaults['year'];
    $defaultMonth = $defaults['month'];
    $defaultDay = $defaults['day'];
    $defaultHour = $defaults['hour'];
    $defaultMinute = $defaults['minute'];
    $enabled = $expirationDate && $expirationEnabled ? 'true' : 'false';
    $categories = '';

    // Values for Quick Edit
    if ($expirationDate) {
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
            $categories = implode(',', $attributes['category']);
        }
    }

    if (empty($categories) && isset($defaultsForPostType['terms'])) {
        $categories = $defaultsForPostType['terms'];
    }

    // the hidden fields will be used by quick edit
    ?>
    <span class="dashicons dashicons-<?php echo esc_attr($iconClass); ?>" title="<?php echo esc_attr($iconTitle); ?>"></span>

    <?php echo esc_html($display); ?>
    <input type="hidden" id="expirationdate_year-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultYear); ?>" />
    <input type="hidden" id="expirationdate_month-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultMonth); ?>" />
    <input type="hidden" id="expirationdate_day-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultDay); ?>" />
    <input type="hidden" id="expirationdate_hour-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultHour); ?>" />
    <input type="hidden" id="expirationdate_minute-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($defaultMinute); ?>" />
    <input type="hidden" id="expirationdate_enabled-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($enabled); ?>" />
    <input type="hidden" id="expirationdate_expireType-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($expireType); ?>" />
    <input type="hidden" id="expirationdate_categories-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($categories); ?>" />
</div>
