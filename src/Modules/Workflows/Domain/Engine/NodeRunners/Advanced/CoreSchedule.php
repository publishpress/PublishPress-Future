<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CoreSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class CoreSchedule implements AsyncNodeRunnerInterface
{
    /**
     * @var AsyncNodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        AsyncNodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
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
        );
    }

    /**
     * This method is called when the action is triggered by the scheduler.
     */
    public function actionCallback(array $expandedArgs, array $originalArgs)
    {
        $this->nodeRunnerProcessor->actionCallback($expandedArgs, $originalArgs);
    }
}
