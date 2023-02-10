<?php

namespace PublishPressFuturePro\Models;

use PublishPressFuture\Framework\WordPress\Facade\OptionsFacade;

class SettingsModel
{
    /**
     * @var \PublishPressFuture\Framework\WordPress\Facade\OptionsFacade
     */
    private $options;

    public function __construct(OptionsFacade $options)
    {
        $this->options = $options;
    }

    public function getWorkflowLogIsEnabled(): bool
    {
        return (bool)$this->options->getOption('ppfuturepro_log_enabled', 1);
    }

    public function setWorkflowLogIsEnabled(bool $value)
    {
        if (null === $this->options->getOption('ppfuturepro_log_enabled', null)) {
            $this->options->addOption('ppfuturepro_log_enabled', $value ? 1 : 0);
        } else {
            $this->options->updateOption('ppfuturepro_log_enabled', $value ? 1 : 0);
        }
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
}
