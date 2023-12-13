<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;

defined('ABSPATH') or die('Direct access not allowed.');

class SanitizationFacade
{
    /**
     * @param string $key
     * @return string
     */
    public function sanitizeKey($key)
    {
        return sanitize_key($key);
    }

    public function sanitizeTextField($value)
    {
        return sanitize_text_field($value);
    }
}
