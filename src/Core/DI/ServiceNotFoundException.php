<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core\DI;

use InvalidArgumentException;

defined('ABSPATH') or die('Direct access not allowed.');

class ServiceNotFoundException extends InvalidArgumentException
{
    public function __construct($message = "", $code = 0, $previous = null)
    {
        $message = "No entry or class found in the container for service '$message'";

        parent::__construct($message, $code, $previous);
    }
}
