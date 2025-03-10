<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnPostUpdate;
use PublishPress\Future\Modules\Workflows\Interfaces\PostCacheInterface;

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

    /**
     * @var PostCacheInterface
     */
    private $postCache;

    public function __construct(
        HookableInterface $hooks,
        StepProcessorInterface $stepProcessor,
        InputValidatorsInterface $postQueryValidator,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory,
        PostCacheInterface $postCache
    ) {
        $this->hooks = $hooks;
        $this->stepProcessor = $stepProcessor;
        $this->postQueryValidator = $postQueryValidator;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->postCache = $postCache;
    }

    public static function getNodeTypeName(): string
    {
        return OnPostUpdate::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->workflowId = $workflowId;

        $this->postCache->setup();

        /*
         * We need to use the save_post action because the post_updated action is triggered too early
         * and some post data (like Future Action data) would not be available yet.
         */
        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 15, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        if (! $update) {
            return;
        }

        $cachedPosts = $this->postCache->getCachedPosts($postId);
        $cachedPermalink = $this->postCache->getPermalink($postId);

        $postBefore = $cachedPosts['postBefore'] ?? null;
        $postAfter = $cachedPosts['postAfter'] ?? null;

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

        $this->variablesHandler->setVariable($nodeSlug, [
            'postBefore' => new PostResolver(
                $postBefore,
                $this->hooks,
                $cachedPermalink['postBefore'],
                $this->expirablePostModelFactory
            ),
            'postAfter' => new PostResolver(
                $postAfter,
                $this->hooks,
                $cachedPermalink['postAfter'],
                $this->expirablePostModelFactory
            ),
        ]);

        $postQueryArgs = [
            'post' => $postAfter,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            function ($step, $postId) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

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
            $postId
        );
    }
}
