<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnAdminInit as NodeTypeCoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnAdminInit implements NodeTriggerRunnerInterface
{
    const NODE_NAME = NodeTypeCoreOnAdminInit::NODE_NAME;

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

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(int $workflowId, array $node, array $routineTree = [])
    {
        $this->node = $node;
        $this->routineTree = $routineTree;

        $this->hooks->addAction(HooksAbstract::ACTION_ADMIN_INIT, [$this, 'triggerCallback'], 10);
    }

    public function triggerCallback()
    {
        // Get next nodes in the routine tree
        $nextSteps = $this->routineTree['next']['output'];

        if (empty($nextSteps)) {
            return false;
        }

        $output = [];

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $output);
        }
    }
}
