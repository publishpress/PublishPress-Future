<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use PostExpirator_Util;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Framework\InitializableInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class ShortcodeController implements InitializableInterface
{
    public function initialize()
    {
        add_shortcode('futureaction', [$this, 'renderShortcode']);

        /**
         * @deprecated 3.0.0 Use "futureaction" short instead
         */
        add_shortcode('postexpirator', [$this, 'renderShortcode']);
    }

    /**
     * Register the shortcode.
     *
     * @internal
     *
     * @access private
     */
    public function renderShortcode($attrs)
    {
        global $post;

        $container = Container::getInstance();
        $factory = $container->get(ServicesAbstract::EXPIRABLE_POST_MODEL_FACTORY);
        $postModel = $factory($post->ID);

        $enabled = $postModel->isExpirationEnabled();
        $expirationDateTs = $postModel->getExpirationDateAsUnixTime();
        if (!$enabled || empty($expirationDateTs)) {
            return false;
        }

        $attrs = shortcode_atts(
            array(
                'dateformat' => get_option('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT),
                'timeformat' => get_option('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT),
                'type' => 'full',
                'tz' => date('T'), // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date
            ),
            $attrs
        );

        if (!isset($attrs['dateformat']) || empty($attrs['dateformat'])) {
            global $expirationdateDefaultDateFormat;
            $attrs['dateformat'] = $expirationdateDefaultDateFormat;
        }

        if (!isset($attrs['timeformat']) || empty($attrs['timeformat'])) {
            global $expirationdateDefaultTimeFormat;
            $attrs['timeformat'] = $expirationdateDefaultTimeFormat;
        }

        if (!isset($attrs['type']) || empty($attrs['type'])) {
            $attrs['type'] = 'full';
        }

        if (!isset($attrs['format']) || empty($attrs['format'])) {
            $attrs['format'] = $attrs['dateformat'] . ' ' . $attrs['timeformat'];
        }

        if ($attrs['type'] === 'full') {
            $attrs['format'] = $attrs['dateformat'] . ' ' . $attrs['timeformat'];
        } elseif ($attrs['type'] === 'date') {
            $attrs['format'] = $attrs['dateformat'];
        } elseif ($attrs['type'] === 'time') {
            $attrs['format'] = $attrs['timeformat'];
        }

        return PostExpirator_Util::get_wp_date($attrs['format'], $expirationDateTs);
    }
}
