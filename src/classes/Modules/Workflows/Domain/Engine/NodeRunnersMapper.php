<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnAdminInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnInit;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnPostUpdated;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\CoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers\FutureLegacyAction;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\RayDebug;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions\CoreDeletePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerMapperInterface;

class NodeRunnersMapper implements NodeRunnerMapperInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(HookableInterface $hooks, \Closure $expirablePostModelFactory)
    {
        $this->hooks = $hooks;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function mapNodeToRunner($nodeName)
    {
        switch ($nodeName) {
            // Triggers
            case CoreOnSavePost::NODE_NAME:
                return new CoreOnSavePost($this->hooks);

            case CoreOnPostUpdated::NODE_NAME:
                return new CoreOnPostUpdated($this->hooks);

            case CoreOnInit::NODE_NAME:
                return new CoreOnInit($this->hooks);

            case CoreOnAdminInit::NODE_NAME:
                return new CoreOnAdminInit($this->hooks);

            case FutureLegacyAction::NODE_NAME:
                return new FutureLegacyAction($this->hooks);

            // Actions
            case RayDebug::NODE_NAME:
                return new RayDebug($this->hooks);

            case CoreDeletePost::NODE_NAME:
                return new CoreDeletePost($this->hooks, $this->expirablePostModelFactory);
        }

        return $this->hooks->applyFilters(HooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_TRIGGER, null, $nodeName);
    }
}
