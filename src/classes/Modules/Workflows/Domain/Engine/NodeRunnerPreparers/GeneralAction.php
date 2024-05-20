<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerPreparers;

use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Traits\InfiniteLoopPreventer;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class GeneralAction implements NodeRunnerPreparerInterface
{
    use InfiniteLoopPreventer;

    /**
     * @var HooksFacade
     */
    private $hooks;

    public function __construct(HooksFacade $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(array $step, callable $actionCallback, array $input = [], array $globalVariables = []): void
    {
        call_user_func($actionCallback, $step, $input, $globalVariables);

        $this->runNextSteps($step, $input, $globalVariables);
    }

    public function runNextSteps(array $step, array $input, array $globalVariables): void
    {
        if ($this->isInfinityLoopDetected()) {
            return;
        }

        $nextSteps = $this->getNextSteps($step);

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             * @var array $input
             * @var array $globalVariables
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $input, $globalVariables);
        }
    }

    public function getNextSteps(array $step)
    {
        $nextSteps = [];
        if (isset($step['next']['output'])) {
            $nextSteps = $step['next']['output'];
        }

        return $nextSteps;
    }

    public function getNodeFromStep(array $step)
    {
        return $step['node'];
    }

    public function getNodeSettings(array $node)
    {
        $nodeSettings = [];
        if (isset($node['data']['settings'])) {
            $nodeSettings = $node['data']['settings'];
        }

        return $nodeSettings;
    }

    public function getWorkflowIdFromGlobalVariables(array $globalVariables)
    {
        return $globalVariables['workflow']['id'] ?? 0;
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log(
                sprintf(
                    '[PublishPress Future Pro] %1$s: workflowId: %2$d, step: %3$s',
                    $message,
                    $workflowId,
                    print_r($step, true)
                )
            );
        }
    }
}
