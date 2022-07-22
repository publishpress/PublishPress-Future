<?php

namespace PublishPressFuture\Module\Settings;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\WordPress\OptionsFacade;
use PublishPressFuture\Core\HooksAbstract as CoreHooksAbstract;

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
     * @param HookableInterface $hooks
     * @param OptionsFacade $options
     */
    public function __construct(HookableInterface $hooks, $options)
    {
        $this->hooks = $hooks;
        $this->options = $options;
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
            'expirationdateDefaultDateFormat' => POSTEXPIRATOR_DATEFORMAT,
            'expirationdateDefaultTimeFormat' => POSTEXPIRATOR_TIMEFORMAT,
            'expirationdateFooterContents' => POSTEXPIRATOR_FOOTERCONTENTS,
            'expirationdateFooterStyle' => POSTEXPIRATOR_FOOTERSTYLE,
            'expirationdateDisplayFooter' => POSTEXPIRATOR_FOOTERDISPLAY,
            'expirationdateDebug' => POSTEXPIRATOR_DEBUGDEFAULT,
            'expirationdateDefaultDate' => POSTEXPIRATOR_EXPIREDEFAULT,
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
