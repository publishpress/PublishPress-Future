<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

interface ServiceProviderInterface
{
    /**
     * @return Closure[] A map of service names and theirs factory method.
     */
    public function getFactories();
}
