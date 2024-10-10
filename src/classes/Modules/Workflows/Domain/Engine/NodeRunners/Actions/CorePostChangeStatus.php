<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class CorePostChangeStatus implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $runtimeVariablesHandler;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        \Closure $expirablePostModelFactory,
        RuntimeVariablesHandlerInterface $runtimeVariablesHandler
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->runtimeVariablesHandler = $runtimeVariablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'actionCallback']);
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->hooks->addFilter(HooksAbstract::FILTER_IGNORE_SAVE_POST_EVENT, '__return_true', 10);

        $postModel = call_user_func($this->expirablePostModelFactory, $postId);

        $newStatus = $nodeSettings['newStatus']['status'];

        if ('publish' === $newStatus) {
            $postModel->publish();
        } else {
            $postModel->setPostStatus($newStatus);
        }

        $this->hooks->removeFilter(HooksAbstract::FILTER_IGNORE_SAVE_POST_EVENT, '__return_true', 10);
    }
}
