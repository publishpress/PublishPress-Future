<?php

namespace PublishPressFuture\Core;


interface ModularInterface
{
    /**
     * Run the method "init" in all the modules, if exists.
     *
     * @return void
     */
    public function initializeModules();

    /**
     * @param InitializableInterface $module
     */
    public function initializeSingleModule($module);
}
