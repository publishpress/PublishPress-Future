<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodePostRelatedRunnerProcessorInterface;

class OnPostWorkflowEnableRunner implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const META_KEY_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered_';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodePostRelatedRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

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
        NodePostRelatedRunnerProcessorInterface $nodeRunnerProcessor,
        InputValidatorsInterface $postQueryValidator,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->postQueryValidator = $postQueryValidator;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, [$this, 'triggerCallback'], 10, 2);
    }

    public function triggerCallback($postId, $workflowId)
    {
        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        if ($this->isInfiniteLoopDetected($this->workflowId, $this->step, $postId)) {
            $this->logger->debug(
                $this->nodeRunnerProcessor->prepareLogMessage(
                    'Infinite loop detected for step %s, skipping',
                    $nodeSlug
                )
            );

            return;
        }

        if ($this->workflowId !== $workflowId) {
            return;
        }

        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'fireTheTrigger'],
            $postId
        );
    }

    public function fireTheTrigger($step, $postId)
    {
        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

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

        $this->nodeRunnerProcessor->setPostIdOnTriggerGlobalVariable($postId);

        ray($this->variablesHandler->getAllVariables());

        $this->logger->debug(
            $this->nodeRunnerProcessor->prepareLogMessage(
                'Trigger is running | Slug: %s | Post ID: %d',
                $nodeSlug,
                $postId
            )
        );

        $this->nodeRunnerProcessor->triggerCallbackIsRunning();
        $this->nodeRunnerProcessor->runNextSteps($this->step);
    }
}
