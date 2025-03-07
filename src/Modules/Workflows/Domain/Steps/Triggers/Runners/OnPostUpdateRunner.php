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
     * @var array
     */
    private $postCache = [];

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
        $this->hooks->addAction(HooksAbstract::ACTION_POST_UPDATED, [$this, 'cachePosts'], 15, 3);
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

        $postBefore = $this->postCache[$postId]['postBefore'] ?? null;
        $postAfter = $this->postCache[$postId]['postAfter'] ?? null;

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

        $postQueryArgs = [
            'post' => $postAfter,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            function ($step, $postId, $postAfter, $postBefore) {
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

    public function cachePosts($postId, $postAfter, $postBefore)
    {
        $this->postCache[$postId] = [
            'postAfter' => $postAfter,
            'postBefore' => $postBefore,
        ];
    }
}
