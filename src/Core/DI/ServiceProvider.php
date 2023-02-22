<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

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
