<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostUpdated as NodeTypeCoreOnPostUpdated;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class CoreOnPostUpdated implements NodeTriggerRunnerInterface
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

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var array
     */
    private $postPermalinkCache = [];

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        InputValidatorsInterface $postQueryValidator,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->postQueryValidator = $postQueryValidator;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreOnPostUpdated::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_PRE_POST_UPDATE, [$this, 'cachePermalink'], 15, 2);
        $this->hooks->addAction(HooksAbstract::ACTION_POST_UPDATED, [$this, 'triggerCallback'], 15, 3);
    }

    public function triggerCallback($postId, $postAfter, $postBefore)
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

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($this->step);

        if ($this->isInfinityLoopDetected($this->workflowId, $this->step)) {
            $this->logger->debug(
                $this->nodeRunnerProcessor->prepareLogMessage(
                    'Infinite loop detected for step %s, skipping',
                    $nodeSlug
                )
            );

            return;
        }

        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $this->step,
            function ($step, $postId, $postAfter, $postBefore) {
                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                $postQueryArgs = [
                    'post' => $postAfter,
                    'node' => $step['node'],
                ];

                if (! $this->postQueryValidator->validate($postQueryArgs)) {
                    return false;
                }

                $this->variablesHandler->setVariable($nodeSlug, [
                    'postId' => new IntegerResolver($postId),
                    'postBefore' => new PostResolver(
                        $postBefore,
                        $this->hooks,
                        $this->postPermalinkCache[$postBefore->ID] ?? '',
                        $this->expirablePostModelFactory
                    ),
                    'postAfter' => new PostResolver(
                        $postAfter,
                        $this->hooks,
                        $this->postPermalinkCache[$postAfter->ID] ?? '',
                        $this->expirablePostModelFactory
                    ),
                ]);

                $this->nodeRunnerProcessor->triggerCallbackIsRunning();

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
                        'Trigger is running | Slug: %s | Post ID: %d',
                        $nodeSlug,
                        $postId
                    )
                );

                $this->nodeRunnerProcessor->runNextSteps($step);
            },
            $postId,
            $postAfter,
            $postBefore
        );
    }

    /**
     * Cache the permalink of the post when it is updated because
     * the post revolver will always return the new permalink of the post.
     * We use this to make sure the post before results the old permalink.
     */
    public function cachePermalink($postId, $data)
    {
        $this->postPermalinkCache[$postId] = get_permalink($postId);
    }
}
