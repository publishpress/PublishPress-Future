<?php

/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Core\DI;

use Closure;

defined('ABSPATH') or die('Direct access not allowed.');

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
     * Singleton instance. This should be kept until we are
     * able to finish the code refactoring removing deprecated
     * legacy code. Otherwise, the legacy code can't reuse the
     * new code structure.
     *
     * @var ContainerInterface
     */
    private static $instance;

    /**
     * @var array
     */
    private $resolvedEntries = [];

    /**
     * @var array
     */
    private $services = [];

    public function __construct($services = [])
    {
        if (! empty($services)) {
            $this->registerServices($services);
        }

        self::$instance = $this;
    }

    public function registerServices($services)
    {
        $this->services = array_merge(
            $this->services,
            $services
        );
    }

    /**
     * @return ContainerInterface
     */
    public static function getInstance()
    {
        if (empty(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return mixed Entry.
     */
    public function get(string $id)
    {
        if (! $this->has($id)) {
            throw new ServiceNotFoundException(esc_html($id));
        }

        if (array_key_exists($id, $this->resolvedEntries)) {
            return $this->resolvedEntries[$id];
        }

        $value = $this->services[$id];

        if ($value instanceof Closure) {
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
    public function has(string $id): bool
    {
        return array_key_exists($id, $this->services)
               || array_key_exists($id, $this->resolvedEntries);
    }
}
