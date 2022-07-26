<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\Helpers;

use DateTimeZone;
use PublishPressFuture\Core\WordPress\DateTimeFacade;

class DateTimeHelper
{
    /**
     * @var DateTimeFacade
     */
    private $dateTime;

    public function __construct($dateTimeFacade)
    {
        $this->dateTime = $dateTimeFacade;
    }

    /**
     * @param string $format
     * @param int $timestamp
     * @return false|string
     */
    public function getWpDate($format, $timestamp)
    {
        $gmtTime = gmdate('Y-m-d H:i:s', $timestamp);
        $timezone = $this->dateTime->getTimezone();
        $datetime = date_create($gmtTime, new DateTimeZone('+0:00'));

        return $this->dateTime->getLocalizedDate($format, $datetime->getTimestamp(), $timezone);
    }
}
