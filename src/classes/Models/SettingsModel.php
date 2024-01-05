<?php

namespace PublishPress\FuturePro\Models;

use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;

defined('ABSPATH') or die('No direct script access allowed.');

class SettingsModel
{
    const OPTION_PRESERVE_DATA = 'expirationdate_preserve_data';

    const OPTION_LICENSE_KEY = 'ppfuturepro_license_key';

    const OPTION_LICENSE_STATUS = 'ppfuturepro_license_status';

    const OPTION_ENABLED_CUSTOM_STATUSES = 'ppfuturepro_enabled_custom_statuses';

    const OPTION_BASE_DATE = 'ppfuturepro_base_date';

    const OPTION_LOG_ENABLED = 'ppfuturepro_log_enabled';

    const BASE_DATE_CURRENT = 'current';

    const BASE_DATE_PUBLISHING = 'publishing';

    /**
     * @var \PublishPress\Future\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var \PublishPress\FuturePro\Models\CustomStatusesModel
     */
    private $customStatusesModel;

    public function __construct(OptionsFacade $options, CustomStatusesModel $customStatusesModel)
    {
        $this->options = $options;
        $this->customStatusesModel = $customStatusesModel;
    }

    /**
     * @return array
     */
    public function getSettings()
    {
        return [
            'preserveDataOnDeactivation' => $this->getPreserveDataOnDeactivation(),
            'licenseKey' => $this->getLicenseKey(),
            'licenseStatus' => $this->getLicenseStatus(),
            'enabledCustomStatuses' => $this->getEnabledCustomStatuses(),
            'baseDate' => $this->getBaseDate(),
        ];
    }

    /**
     * @return bool
     */
    public function getPreserveDataOnDeactivation()
    {
        return (bool)$this->options->getOption(self::OPTION_PRESERVE_DATA, 1);
    }

    /**
     * @return string
     */
    public function getLicenseKey()
    {
        return (string)$this->options->getOption(self::OPTION_LICENSE_KEY, '');
    }

    /**
     * @return string
     */
    public function getLicenseStatus()
    {
        return (string)$this->options->getOption(self::OPTION_LICENSE_STATUS, 'invalid');
    }

    /**
     * @param string $value
     * @return void
     */
    public function setLicenseKey($value)
    {
        if (null === $this->options->getOption(self::OPTION_LICENSE_KEY, null)) {
            $this->options->addOption(self::OPTION_LICENSE_KEY, $value);
        } else {
            $this->options->updateOption(self::OPTION_LICENSE_KEY, $value);
        }
    }

    /**
     * @param string $value
     */
    public function setLicenseStatus($value)
    {
        if (null === $this->options->getOption(self::OPTION_LICENSE_STATUS, null)) {
            $this->options->addOption(self::OPTION_LICENSE_STATUS, $value);
        } else {
            $this->options->updateOption(self::OPTION_LICENSE_STATUS, $value);
        }
    }

    /**
     * @return array
     */
    public function getEnabledCustomStatuses()
    {
        $unsetValue = ['__unset__'];
        $enabledCustomStatuses = $this->options->getOption(
            self::OPTION_ENABLED_CUSTOM_STATUSES,
            $unsetValue
        );

        // Select all the custom statuses if the option is not set for post.
        if ($unsetValue === $enabledCustomStatuses) {
            $enabledCustomStatuses = [
                'post' => array_values($this->customStatusesModel->getCustomStatuses(CustomStatusesModel::OUTPUT_NAMES))
            ];
        }

        return $enabledCustomStatuses;
    }

    /**
     * @param string $postType
     * @return array
     */
    public function getEnabledCustomStatusesForPostType($postType)
    {
        $statuses = $this->getEnabledCustomStatuses();

        return isset($statuses[$postType]) ? $statuses[$postType] : [];
    }

    /**
     * @param array $statuses
     * @return void
     */
    public function setEnabledCustomStatuses($statuses)
    {
        if (
            [-1] === $this->options->getOption(
                self::OPTION_ENABLED_CUSTOM_STATUSES,
                [-1]
            )
        ) {
            $this->options->addOption(self::OPTION_ENABLED_CUSTOM_STATUSES, $statuses);
            return;
        }

        $this->options->updateOption(self::OPTION_ENABLED_CUSTOM_STATUSES, $statuses);
    }

    /**
     * @param string $postType
     * @param array $statuses
     * @return void
     */
    public function setEnabledCustomStatusForPostType($postType, array $statuses)
    {
        $currentPostStatuses = $this->getEnabledCustomStatuses();
        $this->setEnabledCustomStatuses(array_merge($currentPostStatuses, [$postType => $statuses]));
    }

    public function getBaseDate(): string
    {
        return $this->options->getOption(self::OPTION_BASE_DATE, self::BASE_DATE_CURRENT);
    }

    public function setBaseDate(string $value)
    {
        if ($value !== self::BASE_DATE_CURRENT && $value !== self::BASE_DATE_PUBLISHING) {
            throw new \InvalidArgumentException('Invalid base date value');
        }

        $this->options->updateOption(self::OPTION_BASE_DATE, $value);
    }

    public function deleteAllSettings()
    {
        $this->options->deleteOption(self::OPTION_LOG_ENABLED);
        $this->options->deleteOption(self::OPTION_LICENSE_KEY);
        $this->options->deleteOption(self::OPTION_LICENSE_STATUS);
        $this->options->deleteOption(self::OPTION_ENABLED_CUSTOM_STATUSES);
        $this->options->deleteOption(self::OPTION_BASE_DATE);
    }
}
