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
        return (bool)$this->options->getOption('ppfutureproLogEnabled', 1);
    }

    public function setWorkflowLogIsEnabled(bool $value)
    {
        if ('unset' === $this->options->getOption('ppfutureproLogEnabled', 'unset')) {
            $this->options->addOption('ppfutureproLogEnabled', $value ? 1 : 0);
        } else {
            $this->options->updateOption('ppfutureproLogEnabled', $value ? 1 : 0);
        }
    }

    public function getPreserveDataOnDeactivation(): bool
    {
        return (bool)$this->options->getOption('expirationdatePreserveData', 1);
    }
}
