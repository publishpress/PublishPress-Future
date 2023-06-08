<?php

namespace PublishPress\FuturePro\Models;

use PublishPress\Future\Framework\WordPress\Facade\OptionsFacade;

defined('ABSPATH') or die('No direct script access allowed.');

class SettingsModel
{
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
        ];
    }

    /**
     * @return bool
     */
    public function getPreserveDataOnDeactivation()
    {
        return (bool)$this->options->getOption('expirationdate_preserve_data', 1);
    }

    /**
     * @return string
     */
    public function getLicenseKey()
    {
        return (string)$this->options->getOption('ppfuturepro_license_key', '');
    }

    /**
     * @return string
     */
    public function getLicenseStatus()
    {
        return (string)$this->options->getOption('ppfuturepro_license_status', 'invalid');
    }

    /**
     * @param string $value
     * @return void
     */
    public function setLicenseKey($value)
    {
        if (null === $this->options->getOption('ppfuturepro_license_key', null)) {
            $this->options->addOption('ppfuturepro_license_key', $value);
        } else {
            $this->options->updateOption('ppfuturepro_license_key', $value);
        }
    }

    /**
     * @param string $value
     */
    public function setLicenseStatus($value)
    {
        if (null === $this->options->getOption('ppfuturepro_license_status', null)) {
            $this->options->addOption('ppfuturepro_license_status', $value);
        } else {
            $this->options->updateOption('ppfuturepro_license_status', $value);
        }
    }

    /**
     * @return array
     */
    public function getEnabledCustomStatuses()
    {
        $unsetValue = ['__unset__'];
        $enabledCustomStatuses = $this->options->getOption(
            'ppfuturepro_enabled_custom_statuses',
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
                'ppfuturepro_enabled_custom_statuses',
                [-1]
            )
        ) {
            $this->options->addOption('ppfuturepro_enabled_custom_statuses', $statuses);
            return;
        }

        $this->options->updateOption('ppfuturepro_enabled_custom_statuses', $statuses);
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

    public function deleteAllSettings()
    {
        $this->options->deleteOption('ppfuturepro_log_enabled');
        $this->options->deleteOption('ppfuturepro_license_key');
        $this->options->deleteOption('ppfuturepro_license_status');
        $this->options->deleteOption('ppfuturepro_enabled_custom_statuses');
    }
}
