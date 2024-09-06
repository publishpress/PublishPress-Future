<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\IfElse as NodeTypeIfElse;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;

class IfElse implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    private $expressionResult;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeIfElse::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        //TODO: Evaluate the conditional expression
        $this->expressionResult = true;

        // For now, considering it returns true
        $this->runNextSteps($step, $contextVariables);
    }

    public function runNextSteps(array $step, array $contextVariables): void
    {
        $nextSteps = $this->getNextSteps($step);

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             * @var array $contextVariables
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $contextVariables);
        }
    }

    public function getNextSteps(array $step)
    {
        $handleName = $this->expressionResult ? 'true' : 'false';

        $nextSteps = [];
        if (isset($step['next'][$handleName])) {
            $nextSteps = $step['next'][$handleName];
        }

        return $nextSteps;
    }

    public function actionCallback(array $step, array $contextVariables)
    {
        //TODO: Implement the actionCallback method
    }
}
