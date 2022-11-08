<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Models;

class DefaultDataModel
{
    /**
     * @var \PublishPressFuture\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @param \PublishPressFuture\Modules\Settings\SettingsFacade $settings
     * @param \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct($settings, $options)
    {
        $this->settings = $settings;
        $this->options = $options;
    }

    /**
     * @param string $postType
     * @return array
     */
    public function getDefaultExpirationDateForPostType($postType)
    {
        $defaultMonth = date_i18n('m');
        $defaultDay = date_i18n('d');
        $defaultHour = date_i18n('H');
        $defaultYear = date_i18n('Y');
        $defaultMinute = date_i18n('i');
        $timestamp = time();

        $defaultDate = $customDate = $generalDate = $generalCustomDate = '';

        // Get the values from the general settings.
        $generalDate = $this->settings->getDefaultDate();

        if ('custom' === $generalDate) {
            $custom = $this->settings->getDefaultDateCustom();
            if ($custom !== false) {
                $generalCustomDate = $custom;
            }
        }

        // Get the values for the post_type.
        $defaults = $this->settings->getPostTypeDefaults($postType);

        if (isset($defaults['default-expire-type'])) {
            $defaultDate = $defaults['default-expire-type'];
            switch ($defaultDate) {
                case 'custom':
                    $customDate = $defaults['default-custom-date'];
                    break;
                case 'inherit':
                    $customDate = $generalCustomDate;
                    $defaultDate = $generalDate;
                    break;
            }
        } else {
            $defaultDate = $generalDate;
            $customDate = $generalCustomDate;
        }

        if ('custom' === $defaultDate) {
            $custom = $this->settings->getDefaultDateCustom();

            if (! empty($customDate)) {
                $timezoneString = $this->options->getOption('timezone_string');
                if ($timezoneString) {
                    // @TODO Using date_default_timezone_set() and similar isn't allowed, instead use WP internal timezone support.
                    // phpcs:ignore WordPress.DateTime.RestrictedFunctions.timezone_change_date_default_timezone_set
                    date_default_timezone_set($timezoneString);
                }

                // strip the quotes in case the user provides them.
                $customDate = str_replace(
                    '"',
                    '',
                    html_entity_decode($customDate, ENT_QUOTES)
                );

                $timestamp = time() + (strtotime($customDate) - time());
                if ($timezoneString) {
                    // @TODO Using date_default_timezone_set() and similar isn't allowed, instead use WP internal timezone support.
                    // phpcs:ignore WordPress.DateTime.RestrictedFunctions.timezone_change_date_default_timezone_set
                    date_default_timezone_set('UTC');
                }
            }

            $defaultMonth = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp), 'm');
            $defaultDay = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp), 'd');
            $defaultYear = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp), 'Y');
            $defaultHour = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp), 'H');
            $defaultMinute = get_date_from_gmt(gmdate('Y-m-d H:i:s', $timestamp), 'i');
        }

        return array(
            'month' => $defaultMonth,
            'day' => $defaultDay,
            'year' => $defaultYear,
            'hour' => $defaultHour,
            'minute' => $defaultMinute,
            'ts' => $timestamp,
        );
    }

}
