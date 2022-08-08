<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Core\DI\AbstractServices;
use PublishPressFuture\Core\Framework\WordPress\Facade\OptionsFacade;
use PublishPressFuture\Core\HookableInterface;

class SettingsFacade
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var OptionsFacade
     */
    private $options;

    /**
     * @var array $defaultData
     */
    private $defaultData;

    /**
     * @param HookableInterface $hooks
     * @param OptionsFacade $options
     * @param array $defaultData
     */
    public function __construct(HookableInterface $hooks, $options, $defaultData)
    {
        $this->hooks = $hooks;
        $this->options = $options;
        $this->defaultData = $defaultData;
    }

    public function deleteAllSettings()
    {
        $allOptions = [
            'expirationdateExpiredPostStatus',
            'expirationdateExpiredPageStatus',
            'expirationdateDefaultDateFormat',
            'expirationdateDefaultTimeFormat',
            'expirationdateDisplayFooter',
            'expirationdateFooterContents',
            'expirationdateFooterStyle',
            'expirationdateCategory',
            'expirationdateCategoryDefaults',
            'expirationdateDebug',
            'postexpiratorVersion',
            'expirationdateCronSchedule',
            'expirationdateDefaultDate',
            'expirationdateDefaultDateCustom',
            'expirationdateAutoEnabled',
            'expirationdateDefaultsPost',
            'expirationdateDefaultsPage',
            'expirationdateGutenbergSupport',
            'expirationdatePreserveData',
        ];

        // TODO: Remove the custom post type default settings like expirationdateDefaults<post_type>, etc.

        $callback = function ($optionName) {
            $this->options->deleteOption($optionName);
        };

        array_walk($allOptions, $callback);
    }

    public function setDefaultSettings()
    {
        $defaultValues = [
            'expirationdateDefaultDateFormat' => $this->defaultData[AbstractServices::DEFAULT_DATE_FORMAT],
            'expirationdateDefaultTimeFormat' => $this->defaultData[AbstractServices::DEFAULT_TIME_FORMAT],
            'expirationdateFooterContents' => $this->defaultData[AbstractServices::DEFAULT_FOOTER_CONTENT],
            'expirationdateFooterStyle' => $this->defaultData[AbstractServices::DEFAULT_FOOTER_STYLE],
            'expirationdateDisplayFooter' => $this->defaultData[AbstractServices::DEFAULT_FOOTER_DISPLAY],
            'expirationdateDebug' => $this->defaultData[AbstractServices::DEFAULT_DEBUG],
            'expirationdateDefaultDate' => $this->defaultData[AbstractServices::DEFAULT_EXPIRATION_DATE],
            'expirationdateGutenbergSupport' => 1,
        ];

        foreach ($defaultValues as $optionName => $defaultValue) {
            if ($this->options->getOption($optionName) === false) {
                $this->options->updateOption($optionName, $defaultValue);
            }
        }
    }

    /**
     * @param bool $default
     *
     * @return bool
     */
    public function getSettingPreserveData($default = true)
    {
        return (bool)$this->options->getOption('expirationdatePreserveData', $default);
    }

    /**
     * @param bool $default
     * @return bool
     */
    public function getDebugIsEnabled($default = false)
    {
        return (bool)$this->options->getOption('expirationdateDebug', $default);
    }
}
