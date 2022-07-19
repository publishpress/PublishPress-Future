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
     * @var object
     */
    private $legacyPlugin;

    /**
     * @param HookFacadeInterface $filtersFacade
     * @param array $modulesInstanceList
     * @param object $legacyPluginFactory
     */
    public function __construct(HookFacadeInterface $filtersFacade, $modulesInstanceList, $legacyPlugin)
    {
        $this->filtersFacade = $filtersFacade;
        $this->modulesInstanceList = $modulesInstanceList;
        $this->legacyPlugin = $legacyPlugin;

        $this->initModules();
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
