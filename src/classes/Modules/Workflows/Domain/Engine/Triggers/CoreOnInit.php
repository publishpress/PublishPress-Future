<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnInit as NodeTypeCoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowTriggerInterface;

class CoreOnInit implements WorkflowTriggerInterface
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
     * @var string
     */
    private $hookName;

    /**
     * @var array
     */
    private $routineTree;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(array $node, string $hookName, array $routineTree = [])
    {
        $this->node = $node;
        $this->routineTree = $routineTree;
        $this->hookName = $hookName;

        $this->hooks->addAction(HooksAbstract::ACTION_INIT, [$this, 'triggerCallback'], 15);
    }

    public function triggerCallback()
    {
        $this->hooks->doAction($this->hookName, $this->node, $this->routineTree, []);
    }
}
