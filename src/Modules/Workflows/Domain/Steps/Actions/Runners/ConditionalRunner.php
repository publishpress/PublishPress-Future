<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\ConditionalSplit as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class ConditionalRunner implements StepRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $stepProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->variablesHandler = $variablesHandler;
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

    public function setupCallback(array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                // Convert the "true" (default one) to a "next" step.
                // A real conditional split is only handled in the Pro version.
                $step['next']['output'] = $step['next']['true'] ?? [];
                unset($step['next']['true']);
                unset($step['next']['false']);

                $this->variablesHandler->setVariable($nodeSlug, [
                    'branch' => 'true',
                ]);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Step %1$s is a Pro feature, skipping to the true branch',
                        $nodeSlug
                    )
                );

                $this->stepProcessor->runNextSteps($step);
            }
        );
    }
}
