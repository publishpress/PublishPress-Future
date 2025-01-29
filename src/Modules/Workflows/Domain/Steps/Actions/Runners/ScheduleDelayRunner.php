<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\ScheduleDelay;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncStepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncStepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class ScheduleDelayRunner implements AsyncStepRunnerInterface
{
    /**
     * @var AsyncStepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        AsyncStepProcessorInterface $stepProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->variablesHandler = $variablesHandler;
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
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

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
