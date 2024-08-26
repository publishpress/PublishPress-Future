<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\BooleanResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost as NodeTypeCoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnSavePost implements NodeTriggerRunnerInterface
{
    use InfiniteLoopPreventer;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $contextVariables;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var InputValidatorsInterface
     */
    private $postQueryValidator;

    /**
     * @var int
     */
    private $workflowId;


    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        InputValidatorsInterface $postQueryValidator
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->postQueryValidator = $postQueryValidator;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreOnSavePost::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->step = $step;
        $this->contextVariables = $contextVariables;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        if (
            $this->hooks->applyFilters(
                HooksAbstract::FILTER_IGNORE_SAVE_POST_EVENT,
                false,
                self::getNodeTypeName(),
                $this->step
            )
        ) {
            return;
        }

        if ($this->isInfinityLoopDetected($this->workflowId, $this->step)) {
            return;
        }

        $postQueryArgs = [
            'post' => $post,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        $contextVariables = $this->contextVariables;

        $contextVariables[$nodeSlug] = [
            'postId' => new IntegerResolver($postId),
            'post' => new PostResolver($post),
            'update' => new BooleanResolver($update),
        ];

        $this->nodeRunnerProcessor->triggerCallbackIsRunning($this->contextVariables);
        $this->nodeRunnerProcessor->runNextSteps($this->step, $contextVariables);
    }
}
