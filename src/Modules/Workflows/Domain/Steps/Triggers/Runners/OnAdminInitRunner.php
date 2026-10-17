<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnAdminInit;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class OnAdminInitRunner extends ProTriggerStubRunner
{
    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @since 4.3.1
     */
    public function __construct(StepProcessorInterface $stepProcessor, LoggerInterface $logger)
    {
        parent::__construct($stepProcessor, $logger, OnAdminInit::getNodeTypeName());
    }

    /**
     * @return string
     * @since 4.3.1
     */
    public static function getNodeTypeName(): string
    {
        return OnAdminInit::getNodeTypeName();
    }

    /**
     * This trigger stub only logs the Pro skip.
     *
     * @return bool
     * @since 4.3.1
     */
    protected function shouldRunStepSetup(): bool
    {
        return false;
    }
}
