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

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(array $node)
    {
        $this->node = $node;

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        $args = func_get_args();
        $this->hooks->doAction(HooksAbstract::ACTION_TRIGGER_FIRED, self::NODE_NAME, $this->node, $args);
    }
}
