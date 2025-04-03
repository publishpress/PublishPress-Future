<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Processors;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;
use Throwable;

class General implements StepProcessorInterface
{
    public const LOG_PREFIX = '[WF Engine]   - ';

    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        HooksFacade $hooks,
        ExecutionContextInterface $executionContext,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->executionContext = $executionContext;
        $this->logger = $logger;
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        $message = sprintf($message, ...$args);

        return sprintf(
            self::LOG_PREFIX . 'Workflow %1$s: %2$s',
            $this->executionContext->getVariable('global.workflow.id'),
            $message
        );
    }

    public function setup(array $step, callable $setupCallback): void
    {
        call_user_func($setupCallback, $step);

        $this->runNextSteps($step);
    }

    public function runNextSteps(array $step, string $branch = 'output'): void
    {
        $nextSteps = $this->getNextSteps($step, $branch);

        $workflowExecutionId = $this->executionContext->getVariable('global.workflow.execution_id');

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_STEP, $nextStep, $workflowExecutionId);
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

        $workflowId = $this->executionContext->getVariable('global.workflow.id');

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
        $currentRunningWorkflowId = $this->executionContext->getVariable('global.workflow.id');

        if (empty($currentRunningWorkflowId)) {
            return;
        }

        $stepSlug = $step['node']['data']['slug'];

        $this->updateExecutionTraceOnVariablesHandler($stepSlug);
        $this->logStepExecution($stepSlug, $currentRunningWorkflowId);
    }

    private function updateExecutionTraceOnVariablesHandler(string $stepSlug): void
    {
        $currentExecutionTrace = $this->executionContext->getVariable('global.workflow.execution_trace');
        if (! is_array($currentExecutionTrace)) {
            $currentExecutionTrace = [];
        }

        $currentExecutionTrace[] = $stepSlug;

        $this->executionContext->setVariable('global.workflow.execution_trace', $currentExecutionTrace);
    }

    private function logStepExecution(string $stepSlug, int $currentRunningWorkflowId): void
    {
        if (! $this->isWordPressRayInstalled()) {
            return;
        }

        $workflowModel = new WorkflowModel();
        $workflowModel->load($currentRunningWorkflowId);

        if ($workflowModel->isDebugRayShowCurrentRunningStepEnabled()) {
            // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
            ray($stepSlug)->label('Current running step');
        }
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
                    $this->executionContext->getVariable('global.workflow.id'),
                    $th->getMessage(),
                    $th->getFile(),
                    $th->getLine()
                )
            );
        }
    }
}
