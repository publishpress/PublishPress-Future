<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeStatus as NodeTypeCorePostChangeStatus;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class CorePostChangeStatus implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeCorePostChangeStatus::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(int $postId, array $nodeSettings)
    {
        $postModel = call_user_func($this->expirablePostModelFactory, $postId);

        $newStatus = $nodeSettings['postStatus']['newStatus'];

        $postModel->setPostStatus($newStatus);
    }
}
