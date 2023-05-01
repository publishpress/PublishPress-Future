<?php

namespace PublishPressFuturePro\Models;

use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;

defined('ABSPATH') or die('No direct script access allowed.');

class SettingsModel
{
    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    /**
     * @var \PublishPressFuturePro\Models\CustomStatusesModel
     */
    private $customStatusesModel;

    public function __construct(OptionsFacade $options, CustomStatusesModel $customStatusesModel)
    {
        $this->options = $options;
        $this->customStatusesModel = $customStatusesModel;
    }

    public function getSettings(): array
    {
        return [
            'preserveDataOnDeactivation' => $this->getPreserveDataOnDeactivation(),
            'licenseKey' => $this->getLicenseKey(),
            'licenseStatus' => $this->getLicenseStatus(),
            'enabledCustomStatuses' => $this->getEnabledCustomStatuses(),
        ];
    }

    public function getPreserveDataOnDeactivation(): bool
    {
        return (bool)$this->options->getOption('expirationdate_preserve_data', 1);
    }

    public function getLicenseKey(): string
    {
        return (string)$this->options->getOption('ppfuturepro_license_key', '');
    }

    public function getLicenseStatus(): string
    {
        return (string)$this->options->getOption('ppfuturepro_license_status', 'invalid');
    }

    public function setLicenseKey(string $value)
    {
        if (null === $this->options->getOption('ppfuturepro_license_key', null)) {
            $this->options->addOption('ppfuturepro_license_key', $value);
        } else {
            $this->options->updateOption('ppfuturepro_license_key', $value);
        }
    }

    public function setLicenseStatus(string $value)
    {
        if (null === $this->options->getOption('ppfuturepro_license_status', null)) {
            $this->options->addOption('ppfuturepro_license_status', $value);
        } else {
            $this->options->updateOption('ppfuturepro_license_status', $value);
        }
    }

    public function getEnabledCustomStatuses(): array
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

    public function getEnabledCustomStatusesForPostType(string $postType): array
    {
        $statuses = $this->getEnabledCustomStatuses();

        return $statuses[$postType] ?? [];
    }

    public function setEnabledCustomStatuses(array $statuses)
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

    public function setEnabledCustomStatusForPostType(string $postType, array $statuses)
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
