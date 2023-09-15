<?php

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Describes the interface of a container that exposes methods to read its entries.
 *
 * @deprecated 3.1.1 use \PublishPress\Psr\Container\ContainerInterface instead.
 */
interface ContainerInterface extends \PublishPress\Psr\Container\ContainerInterface
{
    public function registerServices($services);
}
