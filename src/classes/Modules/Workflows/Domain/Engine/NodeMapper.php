<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Triggers\CoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Triggers\CoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeMapperInterface;

class NodeMapper implements NodeMapperInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function mapNodeToInstance($nodeName)
    {
        switch ($nodeName) {
            // Triggers
            case CoreOnSavePost::NODE_NAME:
                return new CoreOnSavePost($this->hooks);

            case CoreOnInit::NODE_NAME:
                return new CoreOnInit($this->hooks);

            case CoreOnAdminInit::NODE_NAME:
                return new CoreOnAdminInit($this->hooks);

            // Flows
            // case IfElse::NODE_NAME:
            //     return null;

            // case CoreSchedule::NODE_NAME:
            //     return null;

            // Actions
            // case CoreDeletePost::NODE_NAME:
            //     return null;

            // case CoreUpdatePost::NODE_NAME:
            //     return null;

            // case RayDebug::NODE_NAME:
            //     return null;
        }

        return $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_TRIGGER, null, $nodeName);
    }
}
