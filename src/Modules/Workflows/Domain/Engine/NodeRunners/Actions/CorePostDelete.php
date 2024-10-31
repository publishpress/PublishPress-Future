<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDelete as NodeTypeCorePostDelete;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

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

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var WorkflowEngineInterface
     */
    private $engine;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        \Closure $expirablePostModelFactory,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        WorkflowEngineInterface $engine
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->engine = $engine;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostDelete::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->engine->executeStep(
            $step,
            function ($step, $postId) {
                $postModel = call_user_func($this->expirablePostModelFactory, $postId);
                $postModel->delete(true);

                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
                        'Post %1$s deleted on step %2$s',
                        $postId,
                        $nodeSlug
                    )
                );
            },
            $postId
        );
    }
}

