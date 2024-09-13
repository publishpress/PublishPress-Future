<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnManuallyEnabledForPost implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const META_KEY_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered_';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $contextVariables;

    /**
     * @var InputValidatorsInterface
     */
    private $postQueryValidator;

    /**
     * @var int
     */
    private $workflowId;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        InputValidatorsInterface $postQueryValidator
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->postQueryValidator = $postQueryValidator;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->step = $step;
        $this->contextVariables = $contextVariables;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, [$this, 'triggerCallback'], 10, 2);
    }

    public function triggerCallback($postId, $workflowId)
    {
        if ($this->isInfinityLoopDetected($this->workflowId, $this->step)) {
            return;
        }

        if ($this->workflowId !== $workflowId) {
            return;
        }

        $post = get_post($postId);

        $postQueryArgs = [
            'post' => $post,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        $contextVariables = $this->contextVariables;

        $contextVariables[$nodeSlug] = [
            'postId' => new IntegerResolver($postId),
            'post' => new PostResolver($post),
        ];

        $this->nodeRunnerProcessor->triggerCallbackIsRunning($this->contextVariables);
        $this->nodeRunnerProcessor->runNextSteps($this->step, $contextVariables);
    }
}
