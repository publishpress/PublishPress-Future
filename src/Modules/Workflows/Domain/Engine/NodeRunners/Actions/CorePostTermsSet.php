<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\ErrorFacade;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsSet as NodeTypeCorePostTermsSet;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;

class CorePostTermsSet implements NodeRunnerInterface
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
     * @var ErrorFacade
     */
    private $errorFacade;

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
        ErrorFacade $errorFacade,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        WorkflowEngineInterface $engine
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->errorFacade = $errorFacade;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->engine = $engine;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostTermsSet::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->engine->executeStep(
            $step,
            function ($step, $postId, $nodeSettings) {
                $postModel = call_user_func($this->expirablePostModelFactory, $postId);

                $taxonomy = $nodeSettings['taxonomyTerms']['taxonomy'];
                $updatedTerms = $nodeSettings['taxonomyTerms']['terms'] ?? [];

                $originalTerms = $postModel->getTermIDs($taxonomy);

                $result = $postModel->setTerms($updatedTerms, $taxonomy);

                $resultIsError = $this->errorFacade->isWpError($result);

                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                if ($resultIsError) {
                    $this->logger->error(
                        $this->nodeRunnerProcessor->prepareLogMessage(
                            'Error updating post %1$s terms on step %2$s',
                            $postId,
                            $nodeSlug
                        )
                    );
                } else {
                    $this->logger->debug(
                        $this->nodeRunnerProcessor->prepareLogMessage(
                            'Post %1$s terms updated on step %2$s',
                            $postId,
                            $nodeSlug
                        )
                    );
                }
            },
            $postId,
            $nodeSettings
        );
    }
}
