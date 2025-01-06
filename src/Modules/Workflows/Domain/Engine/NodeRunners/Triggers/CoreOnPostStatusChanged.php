<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostStatusChanged as NodeTypeCoreOnPostStatusChanged;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class CoreOnPostStatusChanged implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        LoggerInterface $logger
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreOnPostStatusChanged::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $this->nodeRunnerProcessor->setup($step, '__return_true');

                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
                        'Step %1$s is a Pro feature, skipping',
                        $nodeSlug
                    )
                );
            }
        );
    }
}
