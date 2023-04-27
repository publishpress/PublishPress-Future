<?php

namespace PublishPress\Future\Core\DI;

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
interface ContainerInterface extends \PublishPress\Psr\Container\ContainerInterface
{
    public function registerServices($services);
}
