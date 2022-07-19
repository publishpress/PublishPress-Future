<?php

namespace PublishPressFuture\Core;

use PublishPressFuture\Core\Exception\ServiceNotFoundException;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;

/**
 * PHP Dependency Injection Container PSR-11.
 * Based on code from https://dev.to/fadymr/php-create-dependency-injection-container-psr-11-like-php-di-or-pimple-128i
 *
 * @copyright 2019 F.R Michel
 * @copyright 2022 PublishPress
 */
class Container implements ContainerInterface
{
    /**
     * @var array
     */
    private $definitions = [];

    /**
     * @var array
     */
    private $resolvedEntries = [];

    public function __construct(array $definitions)
    {
        $this->definitions = array_merge(
            $definitions,
            [ContainerInterface::class => $this]
        );
    }

    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return mixed Entry.
     * @throws ContainerExceptionInterface Error while retrieving the entry.
     *
     * @throws NotFoundExceptionInterface  No entry was found for **this** identifier.
     */
    public function get($id)
    {
        if (!$this->has($id)) {
            throw new ServiceNotFoundException("No entry or class found for '{$id}'");
        }

        if (array_key_exists($id, $this->resolvedEntries)) {
            return $this->resolvedEntries[$id];
        }

        $value = $this->definitions[$id];
        if ($value instanceof \Closure) {
            $value = $value($this);
        }

        $this->resolvedEntries[$id] = $value;

        return $value;
    }

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
    public function has($id)
    {
        return array_key_exists($id, $this->definitions)
            || array_key_exists($id, $this->resolvedEntries);
    }
}
