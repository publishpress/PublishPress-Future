<?php

/**
 * Copyright (c) 2024, Ramble Ventures
 */

namespace PublishPress\Future\Modules\Settings;

use PostExpirator_Facade;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;
use PublishPress\Future\Modules\Expirator\ExpirationActions\ChangePostStatus;
use PublishPress\Future\Modules\Expirator\ExpirationActionsAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

class SettingsFacade
{
    public const OPTION_STEP_SCHEDULE_COMPRESSED_ARGS = 'ppfuture_scheduled_step_args_compression_status';

    public const OPTION_SCHEDULED_STEP_CLEANUP_STATUS = 'ppfuture_scheduled_step_cleanup_status';

    public const OPTION_FINISHED_SCHEDULED_STEP_RETENTION = 'ppfuture_finished_scheduled_step_retention';

    public const OPTION_EXPERIMENTAL_ENABLED = 'ppfuture_experimental_status';

    public const OPTION_METABOX_TITLE = 'expirationdateMetaboxTitle';

    public const OPTION_METABOX_CHECKBOX_LABEL = 'expirationdateMetaboxCheckboxLabel';

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
    public const DEFAULT_CUSTOM_DATE = '+1 week';

    public const DEFAULT_CUSTOM_DATE_OFFSET = '+1 week';

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

        $allOptions = array_merge(
            $allOptions,
            [
                self::OPTION_STEP_SCHEDULE_COMPRESSED_ARGS,
                self::OPTION_SCHEDULED_STEP_CLEANUP_STATUS,
                self::OPTION_FINISHED_SCHEDULED_STEP_RETENTION,
            ]
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
        if (defined('PUBLISHPRESS_FUTURE_FORCE_DEBUG') && constant('PUBLISHPRESS_FUTURE_FORCE_DEBUG')) {
            return true;
        }

        if (! isset($this->cache['debugIsEnabled'])) {
            $this->cache['debugIsEnabled'] = (bool)$this->options->getOption('expirationdateDebug', $default);
        }

        return (bool)$this->cache['debugIsEnabled'];
    }

    public function getSendEmailNotification()
    {
        return (bool)$this->options->getOption('expirationdateEmailNotification', POSTEXPIRATOR_EMAILNOTIFICATION);
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

    public function getHideCalendarByDefault()
    {
        return (bool)$this->options->getOption('expirationdateHideCalendarByDefault', false);
    }

    public function getStepScheduleCompressedArgsStatus(): bool
    {
        return (bool)$this->options->getOption(self::OPTION_STEP_SCHEDULE_COMPRESSED_ARGS, false);
    }

    public function getScheduledWorkflowStepsCleanupStatus(): bool
    {
        return (bool)$this->options->getOption(self::OPTION_SCHEDULED_STEP_CLEANUP_STATUS, true);
    }

    public function getScheduledWorkflowStepsCleanupRetention(): int
    {
        return (int)$this->options->getOption(self::OPTION_FINISHED_SCHEDULED_STEP_RETENTION, 30);
    }

    public function getExperimentalFeaturesStatus(): bool
    {
        $value = (bool)$this->options->getOption(self::OPTION_EXPERIMENTAL_ENABLED, false);
        return $value && PUBLISHPRESS_FUTURE_WORKFLOW_EXPERIMENTAL;
    }

    public function setExperimentalFeaturesStatus(bool $value): void
    {
        $value = $value && PUBLISHPRESS_FUTURE_WORKFLOW_EXPERIMENTAL;
        $this->options->updateOption(self::OPTION_EXPERIMENTAL_ENABLED, $value);
    }

    public function setStepScheduleCompressedArgsStatus(bool $value): void
    {
        $this->options->updateOption(self::OPTION_STEP_SCHEDULE_COMPRESSED_ARGS, $value);
    }

    public function setScheduledWorkflowStepsCleanupStatus(bool $value): void
    {
        $this->options->updateOption(self::OPTION_SCHEDULED_STEP_CLEANUP_STATUS, $value);
    }

    public function setScheduledWorkflowStepsCleanupRetention(int $value): void
    {
        $this->options->updateOption(self::OPTION_FINISHED_SCHEDULED_STEP_RETENTION, $value);
    }

    public function getMetaboxTitle(): ?string
    {
        return $this->options->getOption(self::OPTION_METABOX_TITLE, null);
    }

    public function getMetaboxCheckboxLabel(): ?string
    {
        return $this->options->getOption(self::OPTION_METABOX_CHECKBOX_LABEL, null);
    }

    public function setMetaboxTitle(string $value): void
    {
        $this->options->updateOption(self::OPTION_METABOX_TITLE, $value);
    }

    public function setMetaboxCheckboxLabel(string $value): void
    {
        $this->options->updateOption(self::OPTION_METABOX_CHECKBOX_LABEL, $value);
    }

    public function getDefaultDateFormat(): string
    {
        return $this->options->getOption('expirationdateDefaultDateFormat', POSTEXPIRATOR_DATEFORMAT);
    }

    public function getDefaultTimeFormat(): string
    {
        return $this->options->getOption('expirationdateDefaultTimeFormat', POSTEXPIRATOR_TIMEFORMAT);
    }

    public function getShowInPostFooter(): bool
    {
        return (bool)$this->options->getOption('expirationdateDisplayFooter', POSTEXPIRATOR_FOOTERDISPLAY);
    }

    public function getFooterContents(): string
    {
        return $this->options->getOption('expirationdateFooterContents', POSTEXPIRATOR_FOOTERCONTENTS);
    }

    public function getFooterStyle(): string
    {
        return $this->options->getOption('expirationdateFooterStyle', POSTEXPIRATOR_FOOTERSTYLE);
    }

    public function getAllowUserRoles(): array
    {
        $userRoles = wp_roles()->get_names();

        $allowedUserRoles = [];

        $pluginFacade = PostExpirator_Facade::getInstance();

        foreach ($userRoles as $userRoleName => $userRoleLabel)
        {
            if ($pluginFacade->user_role_can_expire_posts($userRoleName)) {
                $allowedUserRoles[] = $userRoleName;
            }
        }

        return $allowedUserRoles;
    }

    public function getGeneralSettings(): array
    {
        $settings = [
            'defaultDateTimeOffset' => $this->getGeneralDateTimeOffset(),
            'hideCalendarByDefault' => $this->getHideCalendarByDefault(),
            'allowUserRoles' => $this->getAllowUserRoles(),
        ];

        $settings = $this->hooks->applyFilters(HooksAbstract::FILTER_SETTINGS_GENERAL, $settings);

        return $settings;
    }

    public function getNotificationsSettings(): array
    {
        $settings = [
            'enableEmailNotification' => $this->getSendEmailNotification(),
            'enableEmailNotificationToAdmins' => $this->getSendEmailNotificationToAdmins(),
            'emailNotificationAddressesList' => $this->getEmailNotificationAddressesList(),
        ];

        $settings = $this->hooks->applyFilters(HooksAbstract::FILTER_SETTINGS_NOTIFICATIONS, $settings);

        return $settings;
    }

    public function getDisplaySettings(): array
    {
        $settings = [
            'defaultDateFormat' => $this->getDefaultDateFormat(),
            'defaultTimeFormat' => $this->getDefaultTimeFormat(),
            'metaboxTitle' => $this->getMetaboxTitle(),
            'metaboxCheckboxLabel' => $this->getMetaboxCheckboxLabel(),
            'columnStyle' => $this->getColumnStyle(),
            'timeFormatForDatePicker' => $this->getTimeFormatForDatePicker(),
            'showInPostFooter' => $this->getShowInPostFooter(),
            'footerContents' => $this->getFooterContents(),
            'footerStyle' => $this->getFooterStyle(),
        ];

        $settings = $this->hooks->applyFilters(HooksAbstract::FILTER_SETTINGS_DISPLAY, $settings);

        return $settings;
    }

    public function getAdvancedSettings(): array
    {
        $settings = [
            'stepScheduleCompressedArgs' => $this->getStepScheduleCompressedArgsStatus(),
            'scheduledWorkflowStepsCleanup' => $this->getScheduledWorkflowStepsCleanupStatus(),
            'scheduledWorkflowStepsCleanupRetention' => $this->getScheduledWorkflowStepsCleanupRetention(),
            'experimentalFeatures' => $this->getExperimentalFeaturesStatus(),
            'preserveDataDeactivating' => $this->getSettingPreserveData(),
        ];

        $settings = $this->hooks->applyFilters(HooksAbstract::FILTER_SETTINGS_ADVANCED, $settings);

        return $settings;
    }
}
