<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Settings;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Expirator\ExpirationActions\ChangePostStatus;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;

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

    /**
     * @deprecated version 3.2.0 Use self::DEFAULT_CUSTOM_DATE_OFFSET instead.
     */
    const DEFAULT_CUSTOM_DATE = '+1 week';

    const DEFAULT_CUSTOM_DATE_OFFSET = '+1 week';

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

        $this->hooks->addAction(CoreHooksAbstract::ACTION_PURGE_PLUGIN_CACHE, [$this, 'purgeCache']);
    }

    public function purgeCache()
    {
        $this->cache = [];
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

        $this->hooks->doAction(CoreHooksAbstract::ACTION_PURGE_PLUGIN_CACHE);
    }

    // We can't use services from the container here because it is called before they are available, on plugin activation.
    public static function setDefaultSettings()
    {
        $defaultValues = [
            'expirationdateDefaultDateFormat' => __('l F jS, Y', 'post-expirator'),
            'expirationdateDefaultTimeFormat' => __('g:ia', 'post-expirator'),
            'expirationdateFooterContents' => __(
                'Post expires at EXPIRATIONTIME on ACTIONDATE',
                'post-expirator'
            ),
            'expirationdateFooterStyle' => 'font-style: italic;',
            'expirationdateDisplayFooter' => '0',
            'expirationdateDebug' => '0',
            'expirationdateDefaultDate' => 'null',
            'expirationdateTimeFormatForDatePicker' => 'inherited',
        ];

        foreach ($defaultValues as $optionName => $defaultValue) {
            if (get_option($optionName) === false) {
                update_option($optionName, $defaultValue);
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
        if (isset($this->cache['postTypeDefaults']) && isset($this->cache['postTypeDefaults'][$postType])) {
            return $this->cache['postTypeDefaults'][$postType];
        }

        $defaults = [
            'expireType' => null,
            'autoEnable' => null,
            'taxonomy' => null,
            'activeMetaBox' => null,
            'emailnotification' => null,
            'default-expire-type' => null,
            'default-custom-date' => null,
            'terms' => [],
            'newStatus' => null,
        ];

        $defaults = array_merge(
            $defaults,
            (array)$this->options->getOption('expirationdateDefaults' . ucfirst($postType))
        );

        if (empty($defaults['expireType'])) {
            $defaults['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
        }

        if ($defaults['expireType'] === ExpirationActionsAbstract::CHANGE_POST_STATUS) {
            if (empty($defaults['newStatus'])) {
                $defaults['newStatus'] = 'draft';
            }
        }

        if ($defaults['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_DRAFT) {
            $defaults['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $defaults['newStatus'] = 'draft';
        }

        if ($defaults['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_PRIVATE) {
            $defaults['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $defaults['newStatus'] = 'private';
        }

        if ($defaults['expireType'] === ExpirationActionsAbstract::POST_STATUS_TO_TRASH) {
            $defaults['expireType'] = ExpirationActionsAbstract::CHANGE_POST_STATUS;
            $defaults['newStatus'] = 'trash';
        }

        if ($defaults['default-expire-type'] === 'null' || empty($defaults['default-expire-type'])) {
            $defaults['default-expire-type'] = 'inherit';
        }

        if (empty($defaults['taxonomy'])) {
            // Get the first taxonomy of the post as the default value.
            $taxonomies = get_object_taxonomies($postType, 'object');

            if (! empty($taxonomies)) {
                $defaults['taxonomy'] = array_keys($taxonomies)[0];
            }
        }

        // Enable by default for post and page.
        if (is_null($defaults['activeMetaBox'])) {
            $defaults['activeMetaBox'] = in_array($postType, ['post', 'page'], true) ? '1' : '0';
        }

        if (! isset($this->cache['postTypeDefaults'])) {
            $this->cache['postTypeDefaults'] = [];
        }

        $this->cache['postTypeDefaults'][$postType] = $defaults;

        return $this->cache['postTypeDefaults'][$postType];
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
        $defaultDateOffsetOption = $this->options->getOption('expirationdateDefaultDateCustom');

        $defaultDateOffsetOption = html_entity_decode($defaultDateOffsetOption, ENT_QUOTES);
        $defaultDateOffsetOption = preg_replace('/["\'`]/', '', $defaultDateOffsetOption);
        $defaultDateOffsetOption = trim($defaultDateOffsetOption);

        if (empty($defaultDateOffsetOption)) {
            $defaultDateOffsetOption = self::DEFAULT_CUSTOM_DATE_OFFSET;
        }

        return $defaultDateOffsetOption;
    }

    public function getColumnStyle()
    {
        return $this->options->getOption('expirationdateColumnStyle', 'verbose');
    }

    public function getTimeFormatForDatePicker()
    {
        return $this->options->getOption('expirationdateTimeFormatForDatePicker', 'inherited');
    }
}
