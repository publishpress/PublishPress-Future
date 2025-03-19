<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostRowAction;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class OnPostRowActionRunner implements TriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const ACTION_RUN_POST_ROW_ACTION = 'ppfuture-run-post-row-action';

    public const NONCE_RUN_POST_ROW_ACTION = 'ppfuture-workflow-post-row-action-run';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var InputValidatorsInterface
     */
    private $postQueryValidator;

    /**
     * @var int
     */
    private $workflowId;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(
        StepProcessorInterface $stepProcessor,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return OnPostRowAction::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $this->stepProcessor->setup($step, '__return_true');

                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Step %1$s is a Pro feature, skipping',
                        $nodeSlug
                    )
                );
            }
        );
    }
}
