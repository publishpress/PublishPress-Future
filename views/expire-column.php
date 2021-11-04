<div class="post-expire-col" data-id="<?php
echo esc_attr($id); ?>"
     data-expire-attributes="<?php
     echo esc_attr(json_encode($attributes)); ?>">
    <?php
    $expirationEnabled = get_post_meta($id, '_expiration-date-status', true) === 'saved';
    $expirationDate = get_post_meta($id, '_expiration-date', true);
    if ($expirationDate && $expirationEnabled) {
        $display = date_i18n(
            get_option('date_format') . ' ' . get_option('time_format'),
            $expirationDate + (get_option('gmt_offset') * HOUR_IN_SECONDS)
        );
    } else {
        $display = __('Never', 'post-expirator');
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
    <?php
    echo esc_html($display); ?>
    <span id="expirationdate_year-<?php echo $id; ?>" style="display: none;"><?php echo $year; ?></span>
    <span id="expirationdate_month-<?php echo $id; ?>" style="display: none;"><?php echo $month; ?></span>
    <span id="expirationdate_day-<?php echo $id; ?>" style="display: none;"><?php echo $day; ?></span>
    <span id="expirationdate_hour-<?php echo $id; ?>" style="display: none;"><?php echo $hour; ?></span>
    <span id="expirationdate_minute-<?php echo $id; ?>" style="display: none;"><?php echo $minute; ?></span>
    <span id="expirationdate_enabled-<?php echo $id; ?>" style="display: none;"><?php echo $enabled; ?></span>
    <span id="expirationdate_expireType-<?php echo $id; ?>" style="display: none;"><?php echo $expireType; ?></span>
    <span id="expirationdate_categories-<?php echo $id; ?>" style="display: none;"><?php echo $categories; ?></span>
</div>
