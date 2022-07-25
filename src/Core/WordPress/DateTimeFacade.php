<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\WordPress;

use DateTimeZone;

class DateTimeFacade
{
    /**
     * @return DateTimeZone
     */
    public function getTimezone()
    {
        return wp_timezone();
    }

    /**
     * @param string $format
     * @param int $timestamp
     * @param DateTimeZone $timezone
     * @return string|false
     */
    public function getLocalizedDate($format, $timestamp = null, $timezone = null)
    {
        return wp_date($format, $timestamp, $timezone);
    }
}
