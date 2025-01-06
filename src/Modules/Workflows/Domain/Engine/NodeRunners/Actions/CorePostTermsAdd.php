<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Framework\WordPress\Facade\ErrorFacade;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostTermsAdd as NodeTypeCorePostTermsAdd;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class CorePostTermsAdd implements NodeRunnerInterface
{
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
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        \Closure $expirablePostModelFactory,
        ErrorFacade $errorFacade,
        LoggerInterface $logger
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->errorFacade = $errorFacade;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCorePostTermsAdd::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step, $postId, $nodeSettings) {
                $postModel = call_user_func($this->expirablePostModelFactory, $postId);

                $taxonomy = $nodeSettings['taxonomyTerms']['taxonomy'];
                $termsToAdd = $nodeSettings['taxonomyTerms']['terms'] ?? [];

                $originalTerms = $postModel->getTermIDs($taxonomy);
                $updatedTerms = array_merge($originalTerms, $termsToAdd);
                $updatedTerms = array_unique($updatedTerms);

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
