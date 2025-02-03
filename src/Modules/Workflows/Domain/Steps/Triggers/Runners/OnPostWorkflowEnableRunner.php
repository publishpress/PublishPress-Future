<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostWorkflowEnable;
use PublishPress\Future\Modules\Workflows\Interfaces\StepPostRelatedProcessorInterface;

class OnPostWorkflowEnableRunner implements TriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const META_KEY_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered_';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var StepPostRelatedProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var array
     */
    private $step;

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
        HookableInterface $hooks,
        StepPostRelatedProcessorInterface $stepProcessor,
        InputValidatorsInterface $postQueryValidator,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->stepProcessor = $stepProcessor;
        $this->postQueryValidator = $postQueryValidator;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public static function getNodeTypeName(): string
    {
        return OnPostWorkflowEnable::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, [$this, 'triggerCallback'], 10, 2);
    }

    public function triggerCallback($postId, $workflowId)
    {
        $nodeSlug = $this->stepProcessor->getSlugFromStep($this->step);

        if ($this->isInfiniteLoopDetected($this->workflowId, $this->step, $postId)) {
            $this->logger->debug(
                $this->stepProcessor->prepareLogMessage(
                    'Infinite loop detected for step %s, skipping',
                    $nodeSlug
                )
            );

            return;
        }

        if ($this->workflowId !== $workflowId) {
            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'fireTheTrigger'],
            $postId
        );
    }

    public function fireTheTrigger($step, $postId)
    {
        $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

        $post = get_post($postId);

        $postQueryArgs = [
            'post' => $post,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        // TODO: Do we really need to pass the postID if the post is already being passed?
        $this->variablesHandler->setVariable(
            $nodeSlug,
            [
                'postId' => new IntegerResolver($postId),
                'post' => new PostResolver($post, $this->hooks, '', $this->expirablePostModelFactory),
            ]
        );

        $this->stepProcessor->setPostIdOnTriggerGlobalVariable($postId);

        $this->logger->debug(
            $this->stepProcessor->prepareLogMessage(
                'Trigger is running | Slug: %s | Post ID: %d',
                $nodeSlug,
                $postId
            )
        );

        $this->stepProcessor->triggerCallbackIsRunning();
        $this->stepProcessor->runNextSteps($this->step);
    }
}
