<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\ScheduleDelay;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncStepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncStepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;

class ScheduleDelayRunner implements AsyncStepRunnerInterface
{
    /**
     * @var AsyncStepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    public function __construct(
        AsyncStepProcessorInterface $stepProcessor,
        ExecutionContextInterface $executionContext
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->executionContext = $executionContext;
    }

    public static function getNodeTypeName(): string
    {
        return ScheduleDelay::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $this->stepProcessor->setup($step, '__return_true');
            }
        );
    }

    /**
     * This method is called when the action is triggered by the scheduler.
     */
    public function actionCallback(array $expandedArgs, array $originalArgs)
    {
        $this->stepProcessor->actionCallback($expandedArgs, $originalArgs);
    }
}
