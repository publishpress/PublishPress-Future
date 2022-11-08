<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core\DI;

use Closure;
use Psr\Container\ContainerInterface;

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
    private $definitions = [];

    public function __construct($definitions = [])
    {
        if (! empty($definitions)) {
            $this->setDefinitions($definitions);
        }

        self::$instance = $this;
    }

    private function setDefinitions($definitions)
    {
        $this->definitions = array_merge(
            $definitions,
            [ContainerInterface::class => $this]
        );
    }

    /**
     * @return ContainerInterface
     *
     * @throws ContainerNotInitializedException
     */
    public static function getInstance()
    {
        if (empty(self::$instance)) {
            throw new ContainerNotInitializedException();
        }

        return self::$instance;
    }

    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return mixed Entry.
     * @throws ServiceNotFoundException  No entry was found for **this** identifier.
     */
    public function get($id)
    {
        if (! $this->has($id)) {
            throw new ServiceNotFoundException($id);
        }

        if (array_key_exists($id, $this->resolvedEntries)) {
            return $this->resolvedEntries[$id];
        }

        $value = $this->definitions[$id];
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
    public function has($id)
    {
        return array_key_exists($id, $this->definitions)
            || array_key_exists($id, $this->resolvedEntries);
    }

    /**
     * @param ServiceProviderInterface $serviceProvider
     *
     * @return void
     */
    public function register(ServiceProviderInterface $serviceProvider)
    {
        $factories = $serviceProvider->getFactories();

        foreach ($factories as $serviceName => $factory) {
            $this->definitions[$serviceName] = $factory;
        }
    }
}
