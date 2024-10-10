<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\ConditionalSplit as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
class ConditionalSplit implements NodeRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
        $this->variablesHandler = $variablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step);

        // Convert the "true" (default one) to a "next" step.
        // A real conditional split is only handled in the Pro version.
        $step['next']['output'] = $step['next']['true'] ?? [];
        unset($step['next']['true']);
        unset($step['next']['false']);

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

        $this->variablesHandler->setVariable($nodeSlug, [
            'branch' => 'true',
        ]);

        $this->nodeRunnerProcessor->runNextSteps($step);
    }
}
