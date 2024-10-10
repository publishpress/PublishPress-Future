<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction as NodeTypeFutureLegacyAction;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
class FutureLegacyAction implements NodeTriggerRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var int
     */
    private $workflowId;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeFutureLegacyAction::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_LEGACY_ACTION, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $args = [])
    {
        // Check if it came from the correct workflow
        if (! isset($args['workflowId']) || $this->workflowId !== $args['workflowId']) {
            return false;
        }

        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $this->step);

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        $this->variablesHandler->setVariable($nodeSlug, [
            'post' => new PostResolver($post),
        ]);

        $this->nodeRunnerProcessor->triggerCallbackIsRunning();
        $this->nodeRunnerProcessor->runNextSteps($this->step);
    }
}
