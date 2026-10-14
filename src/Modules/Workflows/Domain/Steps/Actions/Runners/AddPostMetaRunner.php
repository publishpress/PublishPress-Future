<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\AddPostMeta;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class AddPostMetaRunner extends ProActionStubRunner
{
    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @since 4.3.1
     */
    public function __construct(StepProcessorInterface $stepProcessor, LoggerInterface $logger)
    {
        parent::__construct($stepProcessor, $logger, AddPostMeta::getNodeTypeName());
    }

    /**
     * @return string
     * @since 4.3.1
     */
    public static function getNodeTypeName(): string
    {
        return AddPostMeta::getNodeTypeName();
    }
}
