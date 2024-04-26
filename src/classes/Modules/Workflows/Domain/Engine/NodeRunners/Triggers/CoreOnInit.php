<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit as NodeTypeCoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnInit implements NodeTriggerRunnerInterface
{
    const NODE_NAME = NodeTypeCoreOnInit::NODE_NAME;

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

    public function setup(array $node, array $routineTree = [])
    {
        $this->node = $node;
        $this->routineTree = $routineTree;

        $this->hooks->addAction(HooksAbstract::ACTION_INIT, [$this, 'triggerCallback'], 15);
    }

    public function triggerCallback()
    {
        // Get next nodes in the routine tree
    }
}
