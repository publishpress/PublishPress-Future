<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\IfElse as NodeTypeIfElse;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\CronSchedulesModelInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;

class IfElse implements NodeRunnerInterface
{
    public const NODE_NAME = NodeTypeIfElse::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    private $expressionResult;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
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
        $socketName = $this->expressionResult ? 'true' : 'false';

        $nextSteps = [];
        if (isset($step['next'][$socketName])) {
            $nextSteps = $step['next'][$socketName];
        }

        return $nextSteps;
    }

    public function actionCallback(array $step, array $contextVariables)
    {
        //TODO: Implement the actionCallback method
    }
}
