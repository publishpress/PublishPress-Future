<?php

namespace PublishPressFuture\Core\WordPress;

use PublishPressFuture\Core\ExecutableInterface;

class ActionsFacade implements ExecutableInterface
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
        return add_action($hookName, $callback, $priority, $acceptedArgs);
    }

    /**
     * Execute the hook
     *
     * @param string $hookName
     * @param array $args
     *
     * @return mixed
     */
    public function do($hookName, $args = [])
    {
        $params = array_merge([
            $hookName,
        ], $args);

        return call_user_func_array('do_action', $params);
    }
}
