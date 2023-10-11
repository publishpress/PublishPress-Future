<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * @deprecated 3.1.1
 */
class ServiceProvider implements ServiceProviderInterface
{
    /**
     * @var \Closure[]
     */
    protected $factories;

    /**
     * @param \Closure[] $factories
     */
    public function __construct($factories)
    {
        $this->factories = $factories;
    }

    /**
     * @inheritDoc
     */
    public function getFactories()
    {
        return $this->factories;
    }
}
