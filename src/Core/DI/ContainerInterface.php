<?php

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
interface ContainerInterface extends \PublishPress\Psr\Container\ContainerInterface
{
    public function registerServices($services);
}
