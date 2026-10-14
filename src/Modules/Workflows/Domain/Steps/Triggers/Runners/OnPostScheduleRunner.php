<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostSchedule;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class OnPostScheduleRunner extends ProTriggerStubRunner
{
    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @since 4.3.1
     */
    public function __construct(StepProcessorInterface $stepProcessor, LoggerInterface $logger)
    {
        parent::__construct($stepProcessor, $logger, OnPostSchedule::getNodeTypeName());
    }

    /**
     * @return string
     * @since 4.3.1
     */
    public static function getNodeTypeName(): string
    {
        return OnPostSchedule::getNodeTypeName();
    }
}
