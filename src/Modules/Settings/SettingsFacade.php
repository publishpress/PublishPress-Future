<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings;

use PublishPress\Future\Core\DI\ServicesAbstract as Services;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

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
     * @var array
     */
    private $cache = [];

    const DEFAULT_CUSTOM_DATE = '+1 week';

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
        // Get all options with the prefix expirationdate
        $allOptions = $this->options->getOptionsWithPrefix('expirationdate');

        $allOptions = array_merge(
            $allOptions,
            $this->options->getOptionsWithPrefix('post-expirator')
        );

        $allOptions = array_merge(
            $allOptions,
            $this->options->getOptionsWithPrefix('postexpirator')
        );

        $allOptions = array_keys($allOptions);

        foreach ($allOptions as $optionName) {
            $this->options->deleteOption($optionName);
        }
    }

    public function setDefaultSettings()
    {
        $defaultValues = [
            'expirationdateDefaultDateFormat' => $this->defaultData[Services::DEFAULT_DATE_FORMAT],
            'expirationdateDefaultTimeFormat' => $this->defaultData[Services::DEFAULT_TIME_FORMAT],
            'expirationdateFooterContents' => $this->defaultData[Services::DEFAULT_FOOTER_CONTENT],
            'expirationdateFooterStyle' => $this->defaultData[Services::DEFAULT_FOOTER_STYLE],
            'expirationdateDisplayFooter' => $this->defaultData[Services::DEFAULT_FOOTER_DISPLAY],
            'expirationdateDebug' => $this->defaultData[Services::DEFAULT_DEBUG],
            'expirationdateDefaultDate' => $this->defaultData[Services::DEFAULT_EXPIRATION_DATE],
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
        if (! isset($this->cache['debugIsEnabled'])) {
            $this->cache['debugIsEnabled'] = (bool)$this->options->getOption('expirationdateDebug', $default);
        }

        return (bool)$this->cache['debugIsEnabled'];
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

        foreach ($emailsList as &$emailAddress) {
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

        $defaults = array_merge(
            $defaults,
            (array)$this->options->getOption('expirationdateDefaults' . ucfirst($postType))
        );

        if (empty($defaults['expireType'])) {
            $defaults['expireType'] = 'draft';
        }

        if ($defaults['default-expire-type'] === 'null' || empty($defaults['default-expire-type'])) {
            $defaults['default-expire-type'] = 'inherit';
        }

        if (empty($defaults['taxonomy'])) {
            // Get the first hierarchical taxonomy of the post as the default value.
            $taxonomies = get_object_taxonomies($postType, 'object');
            $taxonomies = wp_filter_object_list($taxonomies, array('hierarchical' => true));

            if (! empty($taxonomies)) {
                $defaults['taxonomy'] = array_keys($taxonomies)[0];
            }
        }

        return $defaults;
    }

    /**
     * @return mixed
     * @deprecated Use getDefaultDateCustom() instead
     */
    public function getDefaultDate()
    {
        return 'custom';
    }

    /**
     * @return mixed
     * @deprecated Use getGeneralDateTimeOffset() instead
     */
    public function getDefaultDateCustom()
    {
        return $this->getGeneralDateTimeOffset();
    }

    public function getGeneralDateTimeOffset()
    {
        $defaultDateOption = $this->options->getOption('expirationdateDefaultDateCustom');

        if (empty($defaultDateOption)) {
            $defaultDateOption = self::DEFAULT_CUSTOM_DATE;
        }

        return $defaultDateOption;
    }

    public function getColumnStyle()
    {
        return $this->options->getOption('expirationdateColumnStyle', 'verbose');
    }
}
