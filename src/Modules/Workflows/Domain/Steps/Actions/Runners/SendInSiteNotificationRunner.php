<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\SendInSiteNotification;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class SendInSiteNotificationRunner extends ProActionStubRunner
{
    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @since 4.3.1
     */
    public function __construct(StepProcessorInterface $stepProcessor, LoggerInterface $logger)
    {
        parent::__construct($stepProcessor, $logger, SendInSiteNotification::getNodeTypeName());
    }

    /**
     * @return string
     * @since 4.3.1
     */
    public static function getNodeTypeName(): string
    {
        return SendInSiteNotification::getNodeTypeName();
    }
}
