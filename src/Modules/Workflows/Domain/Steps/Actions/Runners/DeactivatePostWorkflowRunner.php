<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\DeactivatePostWorkflow;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Models\PostModel;

class DeactivatePostWorkflowRunner implements StepRunnerInterface
{
    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        StepProcessorInterface $stepProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return DeactivatePostWorkflow::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(int $postId, array $nodeSettings, array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step, $postId, $nodeSettings) {
                $postModel = new PostModel();
                $postModel->load($postId);

                $workflowResolver = $this->variablesHandler->getVariable($nodeSettings['workflow']['variable']);
                $workflowId = $workflowResolver->getValue('id');

                $postModel->removeManuallyEnabledWorkflow($workflowId);

                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Workflow disabled on %1$s completed for post %2$s',
                        $nodeSlug,
                        $postId
                    )
                );
            },
            $postId,
            $nodeSettings
        );
    }
}
