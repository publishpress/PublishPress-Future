<?php

namespace PublishPressFuture\Core\WordPress;

use PublishPressFuture\Core\FilterableInterface;

class FiltersFacade implements FilterableInterface
{
    /**
     * Add a hook
     *
     * @param string $hookName
     * @param callable $callback
     * @param integer $priority
     * @param integer $acceptedArgs
     *
     * @return bool
     */
    public function add($hookName, $callback, $priority = 10, $acceptedArgs = 1)
    {
        return add_filter($hookName, $callback, $priority, $acceptedArgs);
    }

    /**
     * Execute the hook
     *
     * @param string $hookName
     * @param mixed $value
     * @param array $args
     *
     * @return mixed
     */
    public function apply($hookName, $value = null, $args = [])
    {
        $params = array_merge([
            $hookName,
            $value
        ], $args);

        return call_user_func_array('apply_filters', $params);
    }
}
