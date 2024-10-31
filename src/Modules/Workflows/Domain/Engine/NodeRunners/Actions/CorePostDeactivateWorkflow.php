<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CorePostDeactivateWorkflow as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Models\PostModel;

class CorePostDeactivateWorkflow implements NodeRunnerInterface
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
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        WorkflowEngineInterface $engine
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->engine = $engine;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
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
                $postModel = new PostModel();
                $postModel->load($postId);

                $workflowResolver = $this->variablesHandler->getVariable($nodeSettings['workflow']['variable']);
                $workflowId = $workflowResolver->getValue('id');

                $postModel->removeManuallyEnabledWorkflow($workflowId);

                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
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
