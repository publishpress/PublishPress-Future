<?php

/**
 * Copyright (c) 2025, Ramble Ventures
 */

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * @deprecated 3.1.1
 */
interface ServiceProviderInterface
{
    /**
     * @return Closure[] A map of service names and theirs factory method.
     *
     * @deprecated 3.1.1
     */
    public function getFactories();
}
