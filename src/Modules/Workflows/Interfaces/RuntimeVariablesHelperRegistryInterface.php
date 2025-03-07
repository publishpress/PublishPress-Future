<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface RuntimeVariablesHelperRegistryInterface
{
    /**
     * Registers a new helper function
     *
     * @param RuntimeVariablesHelperInterface $helper
     * @return void
     */
    public function register(RuntimeVariablesHelperInterface $helper): void;

    /**
     * Executes a registered helper function
     *
     * @param string $type The helper type
     * @param array $parameters Parameters to pass to the helper function
     * @return mixed The result of the helper function
     * @throws \InvalidArgumentException When helper is not found
     */
    public function execute(string $type, $value, array $parameters = []);

    /**
     * Checks if a helper exists
     *
     * @param string $type The helper type
     * @return bool
     */
    public function hasHelper(string $type): bool;
}
