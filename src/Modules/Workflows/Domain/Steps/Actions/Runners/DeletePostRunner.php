<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDelete as NodeTypeCorePostDelete;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class DeletePostRunner implements StepRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $stepProcessor,
        \Closure $expirablePostModelFactory,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostDelete::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step, $postId) {
                $postModel = call_user_func($this->expirablePostModelFactory, $postId);
                $postModel->delete(true);

                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Post %1$s deleted on step %2$s',
                        $postId,
                        $nodeSlug
                    )
                );
            },
            $postId
        );
    }
}

