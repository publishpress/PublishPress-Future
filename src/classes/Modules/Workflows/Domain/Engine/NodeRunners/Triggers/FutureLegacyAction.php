<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction as NodeTypeFutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class FutureLegacyAction implements NodeTriggerRunnerInterface
{
    public const NODE_NAME = NodeTypeFutureLegacyAction::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var int
     */
    private $workflowId;

    /**
     * @var array
     */
    private $globalVariables;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
    }

    public function setup(int $workflowId, array $step, array $globalVariables = []): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;
        $this->globalVariables = $globalVariables;

        $this->hooks->addAction(HooksAbstract::ACTION_LEGACY_ACTION, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $args = [])
    {
        // Check if it came from the correct workflow
        if (! isset($args['workflowId']) || $this->workflowId !== $args['workflowId']) {
            return false;
        }

        $output = [
            'post' => $post,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $output, $this->globalVariables);
    }
}
