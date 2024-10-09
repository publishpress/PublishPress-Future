<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions\CoreSendEmail as NodeTypeCoreSendEmail;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class CoreSendEmail implements NodeRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeCoreSendEmail::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step, $contextVariables);

        $this->nodeRunnerProcessor->setup($step, '__return_true', $contextVariables);
    }
}
