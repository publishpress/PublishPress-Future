<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostUpdate;

class OnPostUpdateRunner implements TriggerRunnerInterface
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
     * @var StepProcessorInterface
     */
    private $stepProcessor;

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
        StepProcessorInterface $stepProcessor,
        InputValidatorsInterface $postQueryValidator,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooks;
        $this->stepProcessor = $stepProcessor;
        $this->postQueryValidator = $postQueryValidator;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public static function getNodeTypeName(): string
    {
        return OnPostUpdate::getNodeTypeName();
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

        $nodeSlug = $this->stepProcessor->getSlugFromStep($this->step);

        if ($this->isInfiniteLoopDetected($this->workflowId, $this->step, $postId)) {
            $this->logger->debug(
                $this->stepProcessor->prepareLogMessage(
                    'Infinite loop detected for step %s, skipping',
                    $nodeSlug
                )
            );

            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            function ($step, $postId, $postAfter, $postBefore) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

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

                $this->stepProcessor->triggerCallbackIsRunning();

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Trigger is running | Slug: %s | Post ID: %d',
                        $nodeSlug,
                        $postId
                    )
                );

                $this->stepProcessor->runNextSteps($step);
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
