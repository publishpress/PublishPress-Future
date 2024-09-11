<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

class CorePostQuery implements NodeRunnerInterface
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
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_ADVANCED_CORE_POST_QUERY_SETUP,
            $step,
            $contextVariables
        );
    }
}
