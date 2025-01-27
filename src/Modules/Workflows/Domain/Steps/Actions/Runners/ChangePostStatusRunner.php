<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class ChangePostStatusRunner implements StepRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $stepProcessor,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
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
