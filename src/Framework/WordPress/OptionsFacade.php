<?php

namespace PublishPressFuture\Framework\WordPress;

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
        return delete_option($optionName);
    }

    /**
     * @param string $optionName
     * @param mixed $defaultValue
     *
     * @return mixed
     */
    public function getOption($optionName, $defaultValue = false)
    {
        return get_option($optionName, $defaultValue);
    }

    /**
     * @param string $optionName
     * @param mixed $newValue
     * @param string|bool $autoLoad
     * @return void
     */
    public function updateOption($optionName, $newValue, $autoLoad = null)
    {
        update_option($optionName, $newValue, $autoLoad);
    }
}
