<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHelpers;

use DateTime;
use PublishPress\Future\Framework\System\DateTimeHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHelperInterface;

class DateHelper implements RuntimeVariablesHelperInterface
{
    private DateTimeHandlerInterface $dateTimeHandler;

    public function __construct(DateTimeHandlerInterface $dateTimeHandler)
    {
        $this->dateTimeHandler = $dateTimeHandler;
    }

    public function getType(): string
    {
        return 'date';
    }

    public function execute(string $value, array $parameters)
    {
        $inputFormat = $parameters['input'] ?? 'Y-m-d H:i:s';
        $outputFormat = $parameters['output']
            ?? $this->dateTimeHandler->getDateTimeFormat() . ' ' . $this->dateTimeHandler->getTimeFormat();

        $date = DateTime::createFromFormat($inputFormat, $value);

        if ($date === false) {
            return $value;
        }

        if ($parameters['offset'] ?? false) {
            $newDate = $this->dateTimeHandler->getCalculatedTimeWithOffset($date->getTimestamp(), $parameters['offset']);
            $date = DateTime::createFromFormat('U', $newDate);
        }

        return $date->format($outputFormat);
    }
}
