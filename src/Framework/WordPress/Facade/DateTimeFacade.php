<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

use DateTimeZone;

defined('ABSPATH') or die('Direct access not allowed.');

class DateTimeFacade
{
    /**
     * @return \DateTimeZone
     */
    public function getTimezone()
    {
        return \wp_timezone();
    }

    /**
     * @param $format
     * @param $timestamp
     * @param $timezone
     * @return string|null
     */
    public function getLocalizedDate($format, $timestamp = null, $timezone = null)
    {
        $date = \wp_date($format, $timestamp, $timezone);

        return false === $date ? null : $date;
    }

    /**
     * @param string $format
     * @param int|null $timestamp
     * @return string|null
     */
    public function getWpDate($format, $timestamp)
    {
        $gmtTime = gmdate('Y-m-d H:i:s', $timestamp);
        $timezone = $this->getTimezone();
        $datetime = date_create($gmtTime, new DateTimeZone('+0:00'));

        return $this->getLocalizedDate($format, $datetime->getTimestamp(), $timezone);
    }
}
