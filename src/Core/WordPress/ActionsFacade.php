<?php

namespace PublishPressFuture\Core\WordPress;

use PublishPressFuture\Core\HookFacadeInterface;

class ActionsFacade implements HookFacadeInterface
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
     * @param mixed $value
     * @param array $args
     *
     * @return mixed
     */
    public function execute($hookName, $value = null, $args = [])
    {
        $params = array_merge([
            $hookName,
            $value
        ], $args);

        return call_user_func_array('do_action', $params);
    }
}
