<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class PostTypeDefaultDataModel
{
    const EXPECTED_DATE_PARTS = 5;

    const DEFAULT_ACTION = 'draft';

    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var array
     */
    private $cache = [];

    /**
     * @var string
     */
    private $postType = '';

    /**
     * @param \PublishPress\Future\Modules\Settings\SettingsFacade $settings
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct($settings, $options, string $postType)
    {
        $this->settings = $settings;
        $this->options = $options;
        $this->postType = $postType;
    }

    private function getDateTimeOffset()
    {
        $customDateTimeOffset = $this->settings->getGeneralDateTimeOffset();

        $postTypeSettings = $this->settings->getPostTypeDefaults($this->postType);
        if (isset($postTypeSettings['default-expire-type'])
            && 'custom' === $postTypeSettings['default-expire-type']
            && ! empty($postTypeSettings['default-custom-date'])
        ) {
            $customDateTimeOffset = $postTypeSettings['default-custom-date'];
            $customDateTimeOffset = html_entity_decode($customDateTimeOffset, ENT_QUOTES);
            $customDateTimeOffset = preg_replace('/["\'`]/', '', $customDateTimeOffset);
            $customDateTimeOffset = trim($customDateTimeOffset);

            if (empty($customDateTimeOffset)) {
                $customDateTimeOffset = SettingsFacade::DEFAULT_CUSTOM_DATE;
            }
        }

        return $customDateTimeOffset;
    }

    private function extractDateParts($calculatedDate)
    {
        $gmDate = gmdate('Y-m-d H:i:s', $calculatedDate);

        $date = get_date_from_gmt($gmDate, 'Y-m-d-H-i');
        $date = explode('-', $date);

        if (count($date) < self::EXPECTED_DATE_PARTS) {
            throw new \Exception('Unexpected date format: ' . $gmDate);
        }

        return [
            'year' => $date[0],
            'month' => $date[1],
            'day' => $date[2],
            'hour' => $date[3],
            'minute' => $date[4],
            'ts' => $calculatedDate,
            'iso' => $gmDate,
        ];
    }

    /**
     * @return array
     */
    public function getActionDateParts()
    {
        $dateTimeOffset = $this->getDateTimeOffset($this->postType);

        $calculatedDate = strtotime($dateTimeOffset, (int)gmdate('U'));

        if (false === $calculatedDate) {
            throw new \Exception("Invalid date/time offset \"$dateTimeOffset\" for post type \"$this->postType\"");

            $calculatedDate = time();
        }

        return $this->extractDateParts($calculatedDate);
    }

    private function getCache($key)
    {
        if (empty($this->cache)) {
            $this->cache = [];
        }

        if (!isset($this->cache[$key])) {
            $this->cache[$key] = null;
        }

        return $this->cache[$key];
    }

    private function setCache($key, $value)
    {
        if (empty($this->cache)) {
            $this->cache = [];
        }

        $this->cache[$key] = $value;
    }

    private function getDefaults()
    {
        $defaults = $this->getCache('defaults');
        if (empty($defaults)) {
            $defaults = $this->settings->getPostTypeDefaults($this->postType);

            $this->setCache('defaults', $defaults);
        }

        return $defaults;
    }

    private function getSetting($setting)
    {
        $cache = $this->getCache($setting);
        if (empty($cache)) {
            $defaults = $this->getDefaults();
            $cache = $defaults[$setting];

            $this->setCache($setting, $cache);
        }

        return $cache;
    }

    public function isAutoEnabled(): bool
    {
        return (bool)$this->getSetting('autoEnable');
    }

    public function getAction(): string
    {
        $action = $this->getSetting('expireType');

        return empty($action) ? self::DEFAULT_ACTION : $action;
    }

    public function getTaxonomy(): string
    {
        return (string)$this->getSetting('taxonomy');
    }

    public function getTerms(): array
    {
        $terms = explode(',', $this->getSetting('terms'));
        $terms = array_map('intval', $terms);

        return $terms;
    }

    public function getTermsAsString(): string
    {
        return implode(',', $this->getTerms());
    }
}
