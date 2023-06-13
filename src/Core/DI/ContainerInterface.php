<?php

namespace PublishPress\Future\Core\DI;

defined('ABSPATH') or die('Direct access not allowed.');

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
interface ContainerInterface
{
    // @TODO: After end of support of PHP 5.6, change this to extend PublishPress/Psr/Container/ContainerInterface.
    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return mixed Entry.
     */
    public function get($id);

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
     * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return bool
     */
    public function has($id);

    public function registerServices($services);
}
