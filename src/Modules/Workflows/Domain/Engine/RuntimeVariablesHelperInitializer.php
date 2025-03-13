<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperRegistryInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHelpers\DateHelper;
class RuntimeVariablesHelperInitializer implements InitializableInterface
{
    /**
     * @var RuntimeVariablesHelperRegistryInterface
     */
    private $helperRegistry;

    /**
     * @var array
     */
    private $helpers;

    public function __construct(RuntimeVariablesHelperRegistryInterface $helperRegistry, array $helpers)
    {
        $this->helperRegistry = $helperRegistry;
        $this->helpers = $helpers;
    }

    public function initialize(): void
    {
        foreach ($this->helpers as $helper) {
            $this->helperRegistry->register($helper);
        }
    }
}
