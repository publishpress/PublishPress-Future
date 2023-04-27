<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

use DateTimeZone;

class DateTimeFacade
{
    public function getTimezone(): DateTimeZone
    {
        return \wp_timezone();
    }

    public function getLocalizedDate($format, $timestamp = null, $timezone = null): ?string
    {
        $date = \wp_date($format, $timestamp, $timezone);

        return false === $date ? null : $date;
    }

    public function getWpDate(string $format, ?int $timestamp): ?string
    {
        $gmtTime = gmdate('Y-m-d H:i:s', $timestamp);
        $timezone = $this->getTimezone();
        $datetime = date_create($gmtTime, new DateTimeZone('+0:00'));

        return $this->getLocalizedDate($format, $datetime->getTimestamp(), $timezone);
    }
}
