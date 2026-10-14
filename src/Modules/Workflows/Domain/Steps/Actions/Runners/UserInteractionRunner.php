<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UserInteraction;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class UserInteractionRunner extends ProActionStubRunner
{
    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @since 4.3.1
     */
    public function __construct(StepProcessorInterface $stepProcessor, LoggerInterface $logger)
    {
        parent::__construct($stepProcessor, $logger, UserInteraction::getNodeTypeName());
    }

    /**
     * @return string
     * @since 4.3.1
     */
    public static function getNodeTypeName(): string
    {
        return UserInteraction::getNodeTypeName();
    }
}
