<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\IfElse as NodeTypeIfElse;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class IfElse implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        HookableInterface $hooks
    ) {
        $this->hooks = $hooks;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeIfElse::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_ADVANCED_IF_ELSE_SETUP,
            $step,
            $contextVariables
        );
    }
}
