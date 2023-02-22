<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

interface ServiceProviderInterface
{
    /**
     * @return Closure[] A map of service names and theirs factory method.
     */
    public function getFactories();
}
