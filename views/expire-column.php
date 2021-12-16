<?php
defined('ABSPATH') or die('Direct access not allowed.');
?>
<div class="post-expire-col" data-id="<?php echo esc_attr($id); ?>"
     data-expire-attributes="<?php echo esc_attr(json_encode($attributes)); ?>">
    <?php
    $iconClass = '';
    $iconTitle = '';

    $expirationEnabled = PostExpirator_Facade::is_expiration_enabled_for_post($id);
    $expirationDate = get_post_meta($id, '_expiration-date', true);

    if ($expirationDate && $expirationEnabled) {
        $format = get_option('date_format') . ' ' . get_option('time_format');
        $display = PostExpirator_Util::get_wp_date($format, $expirationDate);
        if (PostExpirator_CronFacade::post_has_scheduled_task($id)) {
            $iconClass = 'clock icon-scheduled';
            $iconTitle = __('Cron event scheduled.', 'post-expirator');
        } else {
            $iconClass = 'warning icon-missed';
            $iconTitle = __('Cron event not found!', 'post-expirator');
        }
    } else {
        $display = __('Never', 'post-expirator');
        $iconClass = 'marker icon-never';
    }

    $defaults = get_option('expirationdateDefaults' . ucfirst($post_type));
    $expireType = 'draft';
    if (isset($defaults['expireType'])) {
        $expireType = $defaults['expireType'];
    }

    // these defaults will be used by quick edit
    $defaults = PostExpirator_Facade::get_default_expiry($post_type);

    $year = $defaults['year'];
    $month = $defaults['month'];
    $day = $defaults['day'];
    $hour = $defaults['hour'];
    $minute = $defaults['minute'];
    $enabled = $expirationDate && $expirationEnabled ? 'true' : 'false';
    $categories = '';

    // Values for Quick Edit
    if ($expirationDate) {
        $date = gmdate('Y-m-d H:i:s', $expirationDate);
        $year = get_date_from_gmt($date, 'Y');
        $month = get_date_from_gmt($date, 'm');
        $day = get_date_from_gmt($date, 'd');
        $hour = get_date_from_gmt($date, 'H');
        $minute = get_date_from_gmt($date, 'i');
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

    // the hidden fields will be used by quick edit
    ?>
    <span class="dashicons dashicons-<?php echo esc_attr($iconClass); ?>" title="<?php echo esc_attr($iconTitle); ?>"></span>

    <?php echo esc_html($display); ?>
    <input type="hidden" id="expirationdate_year-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($year); ?>" />
    <input type="hidden" id="expirationdate_month-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($month); ?>" />
    <input type="hidden" id="expirationdate_day-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($day); ?>" />
    <input type="hidden" id="expirationdate_hour-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($hour); ?>" />
    <input type="hidden" id="expirationdate_minute-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($minute); ?>" />
    <input type="hidden" id="expirationdate_enabled-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($enabled); ?>" />
    <input type="hidden" id="expirationdate_expireType-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($expireType); ?>" />
    <input type="hidden" id="expirationdate_categories-<?php echo esc_attr($id); ?>" value="<?php echo esc_attr($categories); ?>" />
</div>
