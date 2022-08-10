<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

use WP_Error;

class ErrorFacade
{
    /**
     * @param mixed $value
     * @return bool
     */
    public function isWpError($value)
    {
        return \is_wp_error($value);
    }

    /**
     * @param WP_Error $error
     * @return string
     */
    public function getWpErrorMessage($error)
    {
        return $error->get_error_message();
    }
}
