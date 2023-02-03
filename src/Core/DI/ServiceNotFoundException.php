<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

use InvalidArgumentException;

class ServiceNotFoundException extends InvalidArgumentException
{
    public function __construct($message = "", $code = 0, $previous = null)
    {
        $message = "No entry or class found in the container for service '$message'";

        parent::__construct($message, $code, $previous);
    }
}
