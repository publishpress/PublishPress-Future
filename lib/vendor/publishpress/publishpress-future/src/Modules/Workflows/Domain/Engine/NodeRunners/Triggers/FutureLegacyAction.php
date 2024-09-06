<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\FutureLegacyAction as NodeTypeFutureLegacyAction;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

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
     * @var array
     */
    private $contextVariables;

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
        return NodeTypeFutureLegacyAction::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;
        $this->contextVariables = $contextVariables;

        $this->hooks->addAction(HooksAbstract::ACTION_LEGACY_ACTION, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $args = [])
    {
        // Check if it came from the correct workflow
        if (! isset($args['workflowId']) || $this->workflowId !== $args['workflowId']) {
            return false;
        }

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        $contextVariables = $this->contextVariables;

        $contextVariables[$nodeSlug] = [
            'post' => new PostResolver($post),
        ];

        $this->nodeRunnerProcessor->triggerCallbackIsRunning($this->contextVariables);
        $this->nodeRunnerProcessor->runNextSteps($this->step, $contextVariables);
    }
}
