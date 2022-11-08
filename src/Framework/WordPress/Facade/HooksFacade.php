<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

use PublishPressFuture\Core\HookableInterface;

use function PublishPressFuture\Framework\WordPress\add_action;
use function PublishPressFuture\Framework\WordPress\add_filter;

class HooksFacade implements HookableInterface
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
    public function addFilter($filterName, $callback, $priority = 10, $acceptedArgs = 1)
    {
        return \add_filter($filterName, $callback, $priority, $acceptedArgs);
    }

    /**
     * Apply filters to the passed value.
     *
     * @param string $filterName
     * @param mixed $valueToBeFiltered
     * @param mixed ...$args
     * @return mixed
     */
    public function applyFilters($filterName, $valueToBeFiltered, ...$args)
    {
        $params = array_merge([
            $filterName,
            $valueToBeFiltered
        ], $args);

        return call_user_func_array('apply_filters', $params);
    }

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
    public function addAction($actionName, $callback, $priority = 10, $acceptedArgs = 1)
    {
        return \add_action($actionName, $callback, $priority, $acceptedArgs);
    }

    /**
     * Execute the action.
     *
     * @param string $actionName
     * @param mixed ...$args
     *
     * @return mixed
     */
    public function doAction($actionName, ...$args)
    {
        $params = array_merge([
            $actionName,
        ], $args);

        return call_user_func_array('do_action', $params);
    }

    /**
     * @param string $pluginFile
     * @param callable $callback
     */
    public function registerDeactivationHook($pluginFile, $callback)
    {
        \register_deactivation_hook($pluginFile, $callback);
    }

    public function ksesRemoveFilters()
    {
        kses_remove_filters();
    }
}
