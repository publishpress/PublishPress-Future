<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Models;

defined('ABSPATH') or die('Direct access not allowed.');

class DefaultDataModel
{
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

    /**
     * @param string $postType
     * @return array
     */
    public function getDefaultExpirationDateForPostType($postType)
    {
        $dateTimeOffset = $this->settings->getGeneralDateTimeOffset();

        $postTypeDefaults = $this->settings->getPostTypeDefaults($postType);
        if (isset($postTypeDefaults['default-expire-type'])
            && 'custom' === $postTypeDefaults['default-expire-type']
            && ! empty($postTypeDefaults['default-expire-date'])
        ) {
            $dateTimeOffset = $postTypeDefaults['default-custom-date'];
        }

        // Strip the quotes in case the user provides them.
        $dateTimeOffset = str_replace(
            '"',
            '',
            html_entity_decode($dateTimeOffset, ENT_QUOTES)
        );

        $calculatedDate = strtotime($dateTimeOffset);

        if (false === $calculatedDate) {
            error_log('PUBLISHPRESS FUTURE: Invalid date/time offset: ' . $dateTimeOffset);

            $calculatedDate = time();
        }

        $gmDate = gmdate('Y-m-d H:i:s', $calculatedDate);
        $date = explode('-', get_date_from_gmt($gmDate, 'Y-m-d-H-i'));

        return array(
            'year' => $date[0],
            'month' => $date[1],
            'day' => $date[2],
            'hour' => $date[3],
            'minute' => $date[4],
            'ts' => $calculatedDate,
        );
    }

}
