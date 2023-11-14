<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class DefaultDataModel
{
    const EXPECTED_DATE_PARTS = 5;

    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settings;

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @param \PublishPress\Future\Modules\Settings\SettingsFacade $settings
     * @param \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade $options
     */
    public function __construct($settings, $options)
    {
        $this->settings = $settings;
        $this->options = $options;
    }

    private function getDateTimeOffset($postType)
    {
        $customDateTimeOffset = $this->settings->getGeneralDateTimeOffset();

        $postTypeDefaults = $this->settings->getPostTypeDefaults($postType);
        if (isset($postTypeDefaults['default-expire-type'])
            && 'custom' === $postTypeDefaults['default-expire-type']
            && ! empty($postTypeDefaults['default-custom-date'])
        ) {
            $customDateTimeOffset = $postTypeDefaults['default-custom-date'];
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
        ];
    }

    /**
     * @param string $postType
     * @return array
     */
    public function getDefaultExpirationDateForPostType($postType)
    {
        if (!is_string($postType) || empty($postType)) {
            throw new \InvalidArgumentException('Invalid post type: ' . var_export($postType, true));
        }

        $dateTimeOffset = $this->getDateTimeOffset($postType);

        $calculatedDate = strtotime($dateTimeOffset, (int)gmdate('U'));

        if (false === $calculatedDate) {
            throw new \Exception("Invalid date/time offset \"$dateTimeOffset\" for post type \"$postType\"");

            $calculatedDate = time();
        }

        return $this->extractDateParts($calculatedDate);
    }
}
