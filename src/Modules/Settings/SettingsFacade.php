<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Settings;

use PublishPressFuture\Core\DI\ServicesAbstract;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;

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
            'expirationdateEmailNotificationAdmins',
            'expirationdateEmailNotificationList',
        ];

        // TODO: Remove the custom post type default settings like expirationdateDefaults<post_type>, etc.

        foreach ($allOptions as $optionName) {
            $this->options->deleteOption($optionName);
        }
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

    public function getSendEmailNotificationToAdmins()
    {
        return (bool)$this->options->getOption(
            'expirationdateEmailNotificationAdmins',
            POSTEXPIRATOR_EMAILNOTIFICATIONADMINS
        );
    }

    public function getEmailNotificationAddressesList()
    {
        $emailsList = $this->options->getOption(
            'expirationdateEmailNotificationList',
            ''
        );

        $emailsList = explode(',', $emailsList);

        foreach ($emailsList as &$emailAddress)
        {
            $emailAddress = filter_var(trim($emailAddress), FILTER_SANITIZE_EMAIL);
        }

        return (array)$emailsList;
    }

    public function getPostTypeDefaults($postType)
    {
        $defaults = [
            'expireType' => null,
            'autoEnable' => null,
            'taxonomy' => null,
            'activeMetaBox' => null,
            'emailnotification' => null,
            'default-expire-type' => null,
            'default-custom-date' => null,
        ];

        return array_merge(
            $defaults,
            (array)$this->options->getOption('expirationdateDefaults' . ucfirst($postType))
        );
    }
}
