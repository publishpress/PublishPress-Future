<?php

namespace PublishPressFuture\Core\WordPress;

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
    public function getOption($optionName, $defaultValue)
    {
        return get_option($optionName, $defaultValue);
    }
}
