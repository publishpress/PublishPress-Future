<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDelete as NodeTypeCorePostDelete;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class CorePostDelete implements NodeRunnerInterface
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

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostDelete::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step, array $contextVariables)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);

        $postModel = call_user_func($this->expirablePostModelFactory, $postId);
        $postModel->delete(true);
    }
}
