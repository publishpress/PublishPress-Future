<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Core;

interface HookableInterface
{
    /**
     * Add a filter hook.
     *
     * @param string $filterName
     * @param callable $callback
     * @param int $priority
     * @param int $acceptedArgs
     *
     * @return bool
     */
    public function addFilter($filterName, $callback, $priority = 10, $acceptedArgs = 1);

    /**
     * Apply filters to the passed value.
     *
     * @param string $filterName
     * @param mixed $valueToBeFiltered
     * @param mixed ...$args
     * @return mixed
     */
    public function applyFilters($filterName, $valueToBeFiltered, ...$args);

    /**
     * Add an action hook.
     *
     * @param string $actionName
     * @param callable $callback
     * @param int $priority
     * @param int $acceptedArgs
     *
     * @return bool
     */
    public function addAction($actionName, $callback, $priority = 10, $acceptedArgs = 1);

    /**
     * Execute the action.
     *
     * @param string $actionName
     * @param mixed ...$args
     *
     * @return mixed
     */
    public function doAction($actionName, ...$args);

    /**
     * @param string $pluginFile
     * @param callable $callback
     */
    public function registerDeactivationHook($pluginFile, $callback);
}
