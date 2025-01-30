<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\UnstickPost;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;

class UnstickPostRunner implements StepRunnerInterface
{
    /**
     * @var StepProcessorInterface
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
        StepProcessorInterface $stepProcessor,
        \Closure $expirablePostModelFactory,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return UnstickPost::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'actionCallback']);
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step, $postId) {
                $postModel = call_user_func($this->expirablePostModelFactory, $postId);
                $postModel->unstick();

                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Post %1$s unstick on step %2$s',
                        $postId,
                        $nodeSlug
                    )
                );
            },
            $postId
        );
    }
}
