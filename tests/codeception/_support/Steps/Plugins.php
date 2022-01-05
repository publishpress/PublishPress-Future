<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace Steps;

trait Plugins
{
    /**
     * @Given the plugin :pluginName is active
     */
    public function pluginIsActive($pluginName)
    {
        activate_plugin($pluginName . '/' . $pluginName . '.php');
    }
}
