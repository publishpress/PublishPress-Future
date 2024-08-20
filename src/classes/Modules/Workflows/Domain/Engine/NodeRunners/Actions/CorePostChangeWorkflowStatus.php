<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CorePostChangeWorkflowStatus as NodeType;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\PostModel;

class CorePostChangeWorkflowStatus implements NodeRunnerInterface
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
        $postModel = new PostModel();
        $postModel->load($postId);

        $workflowResolver = $this->nodeRunnerProcessor->getVariableValueFromContextVariables(
            $nodeSettings['workflow']['variable'],
            $contextVariables
        );
        $workflowId = $workflowResolver->getValue('id');

        $newStatus = $nodeSettings['status']['variable'];

        if ($newStatus === 'toggle') {
            $enabledWorkflows = $postModel->getManuallyEnabledWorkflows();

            if (in_array($workflowId, $enabledWorkflows)) {
                $newStatus = 'disable';
            } else {
                $newStatus = 'enable';
            }
        }

        if (!in_array($newStatus, ['enable', 'disable'])) {
            throw new Exception('Invalid status');
        }

        if ($newStatus === 'enable') {
            $postModel->addManuallyEnabledWorkflow($workflowId);
            $this->hooks->doAction(HooksAbstract::ACTION_MANUALLY_TRIGGERED_WORKFLOW, $postId, $workflowId);
        } else {
            $postModel->removeManuallyEnabledWorkflow($workflowId);
        }
    }
}
