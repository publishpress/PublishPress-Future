<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeType;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnManuallyEnabledForPost implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const NODE_NAME = NodeType::NODE_NAME;

    public const META_KEY_MANUALLY_TRIGGERED = '_pp_workflow_manually_triggered_';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

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
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        InputValidatorsInterface $postQueryValidator
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->postQueryValidator = $postQueryValidator;
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

        $nodeSlug = $this->nodeRunnerPreparer->getSlugFromStep($this->step);

        $contextVariables = $this->contextVariables;

        $contextVariables[$nodeSlug] = [
            'postId' => $postId,
            'post' => $post,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $contextVariables);
    }
}
