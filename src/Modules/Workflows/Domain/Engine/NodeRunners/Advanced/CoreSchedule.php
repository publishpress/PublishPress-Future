<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class CoreSchedule implements AsyncNodeRunnerInterface
{
    /**
     * @var AsyncNodeRunnerProcessorInterface
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

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        AsyncNodeRunnerProcessorInterface $nodeRunnerProcessor,
        HookableInterface $hooks,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step);

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

        $this->variablesHandler->setVariable($nodeSlug, [
            'schedule_date' => 0,
            'is_recurring' => false,
            'recurring_type' => '',
            'recurring_interval' => '',
            'recurring_interval_unit' => '',
            'recurring_count' => '',
            'repeat_until' => '',
            'repeat_until_date' => '',
            'repeat_until_times' => '',
        ]);

        $this->nodeRunnerProcessor->setup($step, '__return_true');
    }

    public function actionCallback(array $expandedArgs, array $originalArgs)
    {
        $this->nodeRunnerProcessor->actionCallback($expandedArgs, $originalArgs);
    }
}
