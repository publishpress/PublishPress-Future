<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\WordPress\Facade\ErrorFacade;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsRemove as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class CorePostTermsRemove implements NodeRunnerInterface
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
     * @var ErrorFacade
     */
    private $errorFacade;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

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
        return NodeType::getNodeTypeName();
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
        $termsToRemove = $nodeSettings['taxonomyTerms']['terms'] ?? [];
        $selectAll = $nodeSettings['taxonomyTerms']['selectAll'] ?? false;

        $originalTerms = $postModel->getTermIDs($taxonomy);

        $updatedTerms = $selectAll ? [] : array_diff($originalTerms, $termsToRemove);

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
