<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Framework\Dependencies\ServicesAbstract;
use PublishPressFuture\Framework\HookableInterface;
use PublishPressFuture\Framework\WordPress\OptionsFacade;
use PublishPressFuture\Modules\Settings\Hooks\ActionsAbstract;

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

    public function onDeactivatePlugin()
    {
        $preserveData = (bool)$this->options->getOption('expirationdatePreserveData', true);

        if ($preserveData) {
            return;
        }

        $this->hooks->doAction(ActionsAbstract::DELETE_ALL_SETTINGS);

        $this->deleteAllSettings();
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
            'expirationdateDefaultDateFormat' => $this->defaultData[ServicesAbstract::DEFAULT_DATE_FORMAT],
            'expirationdateDefaultTimeFormat' => $this->defaultData[ServicesAbstract::DEFAULT_TIME_FORMAT],
            'expirationdateFooterContents' => $this->defaultData[ServicesAbstract::DEFAULT_FOOTER_CONTENT],
            'expirationdateFooterStyle' => $this->defaultData[ServicesAbstract::DEFAULT_FOOTER_STYLE],
            'expirationdateDisplayFooter' => $this->defaultData[ServicesAbstract::DEFAULT_FOOTER_DISPLAY],
            'expirationdateDebug' => $this->defaultData[ServicesAbstract::DEFAULT_DEBUG],
            'expirationdateDefaultDate' => $this->defaultData[ServicesAbstract::DEFAULT_EXPIRATION_DATE],
            'expirationdateGutenbergSupport' => 1,
        ];

        $callback = function ($defaultValue, $optionName) {
            if ($this->options->getOption($optionName) === false) {
                $this->options->updateOption($optionName, $defaultValue);
            }
        };

        array_walk($defaultValues, $callback);
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
    public function getDebug($default = false)
    {
        return (bool)$this->options->getOption('expirationdateDebug', $default);
    }
}
