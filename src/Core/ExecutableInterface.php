<?php

namespace PublishPressFuture\Core;

interface ExecutableInterface
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
    public function add($hookName, $callback, $priority = 10, $acceptedArgs = 1);

    /**
     * Execute the hook
     *
     * @param string $hookName
     * @param mixed $value
     * @param array $args
     *
     * @return mixed
     */
    public function execute($hookName, $value = null, $args = []);
}
