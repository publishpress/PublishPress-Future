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

    public function __construct(HookFacadeInterface $filtersFacade, $modulesInstanceList)
    {
        $this->filtersFacade = $filtersFacade;
        $this->modulesInstanceList = $modulesInstanceList;

        $this->initModules();
        $this->initLegacyPlugin();
    }

    private function initLegacyPlugin()
    {
        PostExpirator_Facade::getInstance();
    }

    private function initModules()
    {
        foreach ($this->modulesInstanceList as $instance) {
            if (is_object($instance) && method_exists($instance, 'init')) {
                $instance->init();
            }
        }
    }
}
