<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

use DateTimeZone;

class DateTimeFacade
{
    /**
     * @return DateTimeZone
     */
    public function getTimezone()
    {
        return \wp_timezone();
    }

    /**
     * @param string $format
     * @param int $timestamp
     * @param DateTimeZone $timezone
     * @return string|false
     */
    public function getLocalizedDate($format, $timestamp = null, $timezone = null)
    {
        return \wp_date($format, $timestamp, $timezone);
    }

    /**
     * @param string $format
     * @param int $timestamp
     * @return false|string
     */
    public function getWpDate($format, $timestamp)
    {
        $gmtTime = gmdate('Y-m-d H:i:s', $timestamp);
        $timezone = $this->getTimezone();
        $datetime = date_create($gmtTime, new DateTimeZone('+0:00'));

        return $this->getLocalizedDate($format, $datetime->getTimestamp(), $timezone);
    }
}
