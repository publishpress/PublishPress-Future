<?php

namespace PublishPressFuture\Core;

use PublishPressFuture\Core\InitializableInterface;

class ModulesManager implements ModularInterface
{

    /**
     * @var ExecutableInterface
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
     * @param ExecutableInterface $filtersFacade
     * @param array $modulesInstanceList
     * @param object $legacyPluginFactory
     */
    public function __construct(ExecutableInterface $filtersFacade, $modulesInstanceList, $legacyPlugin)
    {
        $this->filtersFacade = $filtersFacade;
        $this->modulesInstanceList = $modulesInstanceList;
        $this->legacyPlugin = $legacyPlugin;
    }

    /**
     * Run the method "init" in all the modules, if exists.
     *
     * @return void
     */
    public function initializeAllModules()
    {
        array_map([$this, 'initializeAModule'], $this->modulesInstanceList);
    }

    /**
     * @param InitializableInterface $module
     *
     * @return InitializableInterface
     */
    public function initializeAModule($module)
    {
        if (is_object($module) && method_exists($module, 'initialize')) {
            $module->initialize();
        }

        return $module;
    }
}
