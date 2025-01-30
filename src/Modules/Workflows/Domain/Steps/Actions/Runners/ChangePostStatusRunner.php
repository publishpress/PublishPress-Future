<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\ChangePostStatus;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class ChangePostStatusRunner implements StepRunnerInterface
{
    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        StepProcessorInterface $stepProcessor,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return ChangePostStatus::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Step %1$s is a Pro feature, skipping',
                        $this->stepProcessor->getSlugFromStep($step)
                    )
                );
            }
        );
    }
}
