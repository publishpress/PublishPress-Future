<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost as NodeTypeCoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnSavePost implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    public const NODE_NAME = NodeTypeCoreOnSavePost::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $contextVariables;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

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

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        if ($this->isInfinityLoopDetected($this->workflowId, $this->step)) {
            return;
        }

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
            'update' => $update,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $contextVariables);
    }
}
