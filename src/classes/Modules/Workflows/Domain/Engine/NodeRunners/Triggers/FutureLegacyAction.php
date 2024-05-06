<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction as NodeTypeFutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
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
    private $node;

    /**
     * @var array
     */
    private $routineTree;

    /**
     * @var int
     */
    private $workflowId;

    /**
     * @var array
     */
    private $eventArgs;

    /**
     * @var array
     */
    private $globalVariables;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(int $workflowId, array $node, array $routineTree = [], array $globalVariables = []): void
    {
        $this->node = $node;
        $this->routineTree = $routineTree;
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

        // Get next nodes in the routine tree
        $nextSteps = [];
        if (isset($this->routineTree['next']['output'])) {
            $nextSteps = $this->routineTree['next']['output'];
        }

        if (empty($nextSteps)) {
            return false;
        }

        $output = [
            'post' => $post,
        ];

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $output, $this->globalVariables);
        }
    }
}
