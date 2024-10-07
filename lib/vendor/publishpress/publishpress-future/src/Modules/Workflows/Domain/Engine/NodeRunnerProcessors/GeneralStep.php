<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;

use function PublishPress\Future\logCatchException;

class GeneralStep implements NodeRunnerProcessorInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var WorkflowVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(HooksFacade $hooks, WorkflowVariablesHandlerInterface $variablesHandler)
    {
        $this->hooks = $hooks;
        $this->variablesHandler = $variablesHandler;
    }

    public function setup(array $step, callable $actionCallback, array $contextVariables = []): void
    {
        call_user_func($actionCallback, $step, $contextVariables);

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

    public function getSlugFromStep(array $step)
    {
        $node = $this->getNodeFromStep($step);

        return $node['data']['slug'];
    }

    public function getNodeSettings(array $node)
    {
        $nodeSettings = [];
        if (isset($node['data']['settings'])) {
            $nodeSettings = $node['data']['settings'];
        }

        return $nodeSettings;
    }

    public function getWorkflowIdFromContextVariables(array $contextVariables)
    {
        $workflowId = $this->variablesHandler->parseNestedVariableValue('global.workflow.id', $contextVariables);

        return ! empty($workflowId) ? $workflowId : 0;
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        if (! function_exists('error_log')) {
            return;
        }

        error_log(
            sprintf(
                '%1$s: workflowId: %2$d, step: %3$s',
                $message,
                $workflowId,
                print_r($step, true) // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_print_r
            )
        );
    }

    public function getVariableValueFromContextVariables(string $variableName, array $contextVariables)
    {
        $variableName = explode('.', $variableName);

        if (! array_key_exists($variableName[0], $contextVariables)) {
            return null;
        }

        $variable = $contextVariables[$variableName[0]];
        $variableName = array_slice($variableName, 1);

        if (count($variableName) === 0) {
            return $variable;
        }

        foreach ($variableName as $variablePart) {
            if (is_array($variable) && isset($variable[$variablePart])) {
                $variable = $variable[$variablePart];
            } elseif (is_object($variable) && isset($variable->{$variablePart})) {
                $variable = $variable->{$variablePart};
            } else {
                $variable = null;
                break;
            }
        }

        return $variable;
    }

    private function isWordPressRayInstalled(): bool
    {
        return class_exists('Spatie\\WordPressRay\\Ray');
    }

    private function activateGlobalRayDebug(array $contextVariables): void
    {
        if (! $this->isWordPressRayInstalled()) {
            return;
        }

        $workflowId = $this->getWorkflowIdFromContextVariables($contextVariables);

        $workflowModel = new WorkflowModel();
        $workflowModel->load($workflowId);

        if ($workflowModel->isDebugRayShowQueriesEnabled()) {
            // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
            ray()->showQueries();
        }

        if ($workflowModel->isDebugRayShowEmailsEnabled()) {
            // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
            ray()->showMails();
        }

        if ($workflowModel->isDebugRayShowWordPressErrorsEnabled()) {
            // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
            ray()->showWordPressErrors();
        }
    }

    public function triggerCallbackIsRunning(array $contextVariables): void
    {
        $this->activateGlobalRayDebug($contextVariables);
    }
}
