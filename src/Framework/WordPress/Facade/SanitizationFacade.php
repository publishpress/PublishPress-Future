<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Framework\WordPress\Facade;


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
}
