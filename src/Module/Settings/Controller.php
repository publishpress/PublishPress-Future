<?php

namespace PublishPressFuture\Module\Settings;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\WordPress\OptionsFacade;
use PublishPressFuture\Core\HooksAbstract as CoreHooksAbstract;
use PublishPressFuture\Core\ServicesAbstract;

class Controller implements InitializableInterface
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

    public function initialize()
    {
        $this->hooks->addAction(CoreHooksAbstract::ACTION_ACTIVATE_PLUGIN, [$this, 'onActivatePlugin']);
        $this->hooks->addAction(CoreHooksAbstract::ACTION_DEACTIVATE_PLUGIN, [$this, 'onDeactivatePlugin']);

        $this->hooks->addFilter(HooksAbstract::FILTER_GET_SETTING, [$this, 'getSetting']);
    }

    public function onActivatePlugin()
    {
        $this->setDefaultSettings();
    }

    public function onDeactivatePlugin()
    {
        $preserveData = (bool)$this->options->getOption('expirationdatePreserveData', true);

        if ($preserveData) {
            return;
        }

        $this->hooks->doAction(HooksAbstract::ACTION_DELETE_ALL_SETTINGS);

        $this->deleteAllSettings();
    }

    private function setDefaultSettings()
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

        $callback = function($defaultValue, $optionName) {
            if ($this->options->getOption($optionName) === false) {
                $this->options->updateOption($optionName, $defaultValue);
            }
        };

        array_walk($defaultValues,$callback);
    }

    private function deleteAllSettings()
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

        $callback = function($optionName) {
            $this->options->deleteOption($optionName);
        };

        array_walk($allOptions, $callback);
    }

    /**
     * @param string $settingName
     *
     * @return mixed
     */
    public function getSetting($settingName)
    {

    }
}
