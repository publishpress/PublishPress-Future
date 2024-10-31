<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\ConditionalSplit as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class ConditionalSplit implements NodeRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var WorkflowEngineInterface
     */
    private $engine;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        WorkflowEngineInterface $engine
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->engine = $engine;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(array $step)
    {
        $this->engine->executeStep(
            $step,
            function ($step) {
                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                // Convert the "true" (default one) to a "next" step.
                // A real conditional split is only handled in the Pro version.
                $step['next']['output'] = $step['next']['true'] ?? [];
                unset($step['next']['true']);
                unset($step['next']['false']);

                $this->variablesHandler->setVariable($nodeSlug, [
                    'branch' => 'true',
                ]);

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
                        'Step %1$s is a Pro feature, skipping to the true branch',
                        $nodeSlug
                    )
                );

                $this->nodeRunnerProcessor->runNextSteps($step);
            }
        );
    }
}
