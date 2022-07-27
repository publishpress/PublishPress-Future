<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework;


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
