<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost as NodeTypeCoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowTriggerInterface;

class CoreOnSavePost implements WorkflowTriggerInterface
{
    const NODE_NAME = NodeTypeCoreOnSavePost::NODE_NAME;

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

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        $args = func_get_args();

        $this->hooks->doAction($this->hookName, $this->node, $this->routineTree, $args);
    }
}
