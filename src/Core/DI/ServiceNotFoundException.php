<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

use InvalidArgumentException;
use Psr\Container\NotFoundExceptionInterface;

class ServiceNotFoundException extends InvalidArgumentException implements NotFoundExceptionInterface
{
    public function __construct($message = "", $code = 0, $previous = null)
    {
        $message = "No entry or class found in the container for service '$message'";

        parent::__construct($message, $code, $previous);
    }
}
