<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\ArrayResolver;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowModelInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use Throwable;

class GeneralStep implements NodeRunnerProcessorInterface
{
    const LOG_PREFIX = '[WF Engine]   - ';

    /**
     * @var HooksFacade
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

    /**
     * @var WorkflowEngineInterface
     */
    private $engine;

    public function __construct(
        HooksFacade $hooks,
        WorkflowEngineInterface $engine,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->engine = $engine;
        $this->variablesHandler = $engine->getVariablesHandler();
        $this->logger = $logger;
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        $message = sprintf($message, ...$args);

        return sprintf(
            self::LOG_PREFIX . 'Workflow %1$s: %2$s',
            $this->variablesHandler->getVariable('global.workflow.id'),
            $message
        );
    }

    private function addDebugLogMessage(string $message, ...$args): void
    {
        $this->logger->debug($this->prepareLogMessage($message, ...$args));
    }

    public function setup(array $step, callable $setupCallback): void
    {
        call_user_func($setupCallback, $step);

        $this->runNextSteps($step);
    }

    public function runNextSteps(array $step, string $branch = 'output'): void
    {
        $nextSteps = $this->getNextSteps($step, $branch);

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep);
        }
    }

    public function getNextSteps(array $step, string $branch = 'output'): array
    {
        $nextSteps = [];
        if (isset($step['next'][$branch])) {
            $nextSteps = $step['next'][$branch];
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

    /**
     * @deprecated 4.1.0 Use the logger instead
     */
    public function logError(string $message, int $workflowId, array $step)
    {
        $this->logger->error($this->prepareLogMessage($message));
    }

    private function isWordPressRayInstalled(): bool
    {
        return class_exists('Spatie\\WordPressRay\\Ray');
    }

    private function activateGlobalRayDebug(): void
    {
        if (! $this->isWordPressRayInstalled()) {
            return;
        }

        $workflowId = $this->variablesHandler->getVariable('global.workflow.id');

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

    public function triggerCallbackIsRunning(): void
    {
        $this->activateGlobalRayDebug();
    }

    private function handleStepExecution(array $step): void
    {
        $currentRunningWorkflow = $this->engine->getCurrentRunningWorkflow();

        if (empty($currentRunningWorkflow)) {
            return;
        }

        $stepSlug = $step['node']['data']['slug'];

        $this->updateExecutionTraceOnVariablesHandler($stepSlug, $currentRunningWorkflow);
        $this->logStepExecution($stepSlug, $currentRunningWorkflow);
    }

    private function updateExecutionTraceOnVariablesHandler(
        string $stepSlug,
        WorkflowModelInterface $currentRunningWorkflow
    ): void
    {
        $currentExecutionTrace = $this->engine->getCurrentExecutionTrace();
        $currentExecutionTrace[] = $stepSlug;

        // Update the trace global variable.
        $globalVariables = $this->variablesHandler->getVariable('global');
        $globalVariables['trace'] = new ArrayResolver($currentExecutionTrace);
        $this->variablesHandler->setVariable('global', $globalVariables);
    }

    private function logStepExecution(string $stepSlug, WorkflowModelInterface $currentRunningWorkflow): void
    {
        if (! $this->isWordPressRayInstalled()) {
            return;
        }

        if (! $currentRunningWorkflow->isDebugRayShowCurrentRunningStepEnabled()) {
            return;
        }

        // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
        ray($stepSlug)->label('Current running step');
    }

    public function executeSafelyWithErrorHandling(array $step, callable $callback, ...$args): void
    {
        try {
            $this->handleStepExecution($step);

            call_user_func($callback, $step, ...$args);
        } catch (Throwable $th) {
            $this->logger->error(
                sprintf(
                    'Error executing step: %s | Workflow ID: %d | Message: %s, on file %s, line %d',
                    $step['node']['data']['slug'] ?? 'unknown',
                    $this->engine->getCurrentRunningWorkflow()->getId(),
                    $th->getMessage(),
                    $th->getFile(),
                    $th->getLine()
                )
            );
        }
    }
}
