<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooRemoveMembership;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

/**
 * Pro feature. The functional implementation lives in the Pro plugin; in the
 * free plugin this runner is a no-op that logs a skip.
 */
class WooRemoveMembershipRunner implements StepRunnerInterface
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
        return WooRemoveMembership::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debugWithArgs('Step %1$s is a Pro feature, skipping', $nodeSlug);
            }
        );
    }
}
