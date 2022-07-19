<?php

namespace PublishPressFuture\Core;

use PostExpirator_Facade;

class Plugin
{
    /**
     * @var HookFacadeInterface
     */
    private $filtersFacade;

    /**
     * @var array
     */
    private $modulesInstanceList;

    /**
     * @param HookFacadeInterface $filtersFacade
     * @param array $modulesInstanceList
     */
    public function __construct(HookFacadeInterface $filtersFacade, $modulesInstanceList)
    {
        $this->filtersFacade = $filtersFacade;
        $this->modulesInstanceList = $modulesInstanceList;

        $this->initModules();
        $this->initLegacyPlugin();
    }

    /**
     * Initialize the legacy plugin until we finish refactoring it.
     *
     * @return void
     */
    private function initLegacyPlugin()
    {
        PostExpirator_Facade::getInstance();
    }

    /**
     * Run the method "init" in all the modules, if exists.
     *
     * @return void
     */
    private function initModules()
    {
        foreach ($this->modulesInstanceList as $instance) {
            if (is_object($instance) && method_exists($instance, 'init')) {
                $instance->init();
            }
        }
    }
}
