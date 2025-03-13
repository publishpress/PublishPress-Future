<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperRegistryInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperInterface;

class RuntimeVariablesHelperRegistry implements RuntimeVariablesHelperRegistryInterface
{
    private array $helpers = [];

    public function register(RuntimeVariablesHelperInterface $helper): void
    {
        $this->helpers[$helper->getType()] = $helper;
    }

    public function execute(string $type, $value, array $parameters = [])
    {
        if (!$this->hasHelper($type)) {
            throw new \InvalidArgumentException(
                sprintf('Runtime variable helper "%s" not found', $type)
            );
        }

        /**
         * @var RuntimeVariablesHelperInterface $helper
         */
        $helper = $this->helpers[$type];

        return $helper->execute($value, $parameters);
    }

    public function hasHelper(string $type): bool
    {
        return isset($this->helpers[$type]);
    }
}
