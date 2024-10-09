<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDeactivateWorkflow as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Models\PostModel;

class CorePostDeactivateWorkflow implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step, array $contextVariables)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);

        $postModel = new PostModel();
        $postModel->load($postId);

        $workflowResolver = $this->nodeRunnerProcessor->getVariableValueFromContextVariables(
            $nodeSettings['workflow']['variable'],
            $contextVariables
        );
        $workflowId = $workflowResolver->getValue('id');

        $postModel->removeManuallyEnabledWorkflow($workflowId);
    }
}
