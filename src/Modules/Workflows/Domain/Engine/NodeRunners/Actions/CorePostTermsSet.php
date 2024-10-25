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

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        \Closure $expirablePostModelFactory,
        ErrorFacade $errorFacade,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->errorFacade = $errorFacade;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostTermsSet::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'actionCallback']);
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step);

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
    }
}
