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
        $this->hooks->addAction(CoreHooksAbstract::ACTION_DEACTIVATE_PLUGIN, [$this, 'onDeactivatePlugin']);

        $this->hooks->addFilter(HooksAbstract::FILTER_GET_SETTING, [$this, 'getSetting']);
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

    private function deleteAllSettings()
    {
        $this->options->deleteOption('expirationdateExpiredPostStatus');
        $this->options->deleteOption('expirationdateExpiredPageStatus');
        $this->options->deleteOption('expirationdateDefaultDateFormat');
        $this->options->deleteOption('expirationdateDefaultTimeFormat');
        $this->options->deleteOption('expirationdateDisplayFooter');
        $this->options->deleteOption('expirationdateFooterContents');
        $this->options->deleteOption('expirationdateFooterStyle');
        $this->options->deleteOption('expirationdateCategory');
        $this->options->deleteOption('expirationdateCategoryDefaults');
        $this->options->deleteOption('expirationdateDebug');
        $this->options->deleteOption('postexpiratorVersion');
        $this->options->deleteOption('expirationdateCronSchedule');
        $this->options->deleteOption('expirationdateDefaultDate');
        $this->options->deleteOption('expirationdateDefaultDateCustom');
        $this->options->deleteOption('expirationdateAutoEnabled');
        $this->options->deleteOption('expirationdateDefaultsPage');
        $this->options->deleteOption('expirationdateDefaultsPost');
        $this->options->deleteOption('expirationdateGutenbergSupport');
        $this->options->deleteOption('expirationdatePreserveData');
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
