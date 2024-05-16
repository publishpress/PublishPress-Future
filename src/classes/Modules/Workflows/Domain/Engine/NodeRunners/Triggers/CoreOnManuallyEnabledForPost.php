<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeTypeCoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnManuallyEnabledForPost implements NodeTriggerRunnerInterface
{
    const NODE_NAME = NodeTypeCoreOnManuallyEnabledForPost::NODE_NAME;

    const META_KEY_MANUALLY_TRIGGERED = '_workflow_manually_triggered_';

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
    private $globalVariables;

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

    public function setup(int $workflowId, array $step, array $globalVariables = []): void
    {
        $this->step = $step;
        $this->globalVariables = $globalVariables;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, [$this, 'triggerCallback'], 10, 2);
    }

    public function triggerCallback($postId, $workflowId)
    {
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

        $output = [
            'postId' => $postId,
            'post' => $post,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $output, $this->globalVariables);
    }
}
