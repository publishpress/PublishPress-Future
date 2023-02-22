<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Framework\WordPress\Facade;

use function PublishPressFuture\Framework\WordPress\get_option;

class OptionsFacade
{
    public function initialize()
    {
    }

    /**
     * @param string $optionName
     *
     * @return bool
     */
    public function deleteOption($optionName)
    {
        return \delete_option($optionName);
    }

    /**
     * @param string $optionName
     * @param mixed $defaultValue
     *
     * @return mixed
     */
    public function getOption($optionName, $defaultValue = false)
    {
        return \get_option($optionName, $defaultValue);
    }

    /**
     * @param string $optionName
     * @param mixed $newValue
     * @param string|bool $autoLoad
     * @return bool
     */
    public function updateOption($optionName, $newValue, $autoLoad = null)
    {
        return \update_option($optionName, $newValue, $autoLoad);
    }

    /**
     * @param string $optionName
     * @param mixed $newValue
     * @return bool
     */
    public function addOption($optionName, $newValue)
    {
        return \add_option($optionName, $newValue);
    }
}
