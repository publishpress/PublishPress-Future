<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use PublishPress\Future\Modules\Workflows\Models\WorkflowModel;

class GeneralStep implements NodeRunnerProcessorInterface
{
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

    public function __construct(
        HooksFacade $hooks,
        WorkflowEngineInterface $engine,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->variablesHandler = $engine->getVariablesHandler();
        $this->logger = $logger;
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        $message = sprintf($message, ...$args);

        return sprintf(
            '[Workflow "%1$s"] %2$s',
            $this->variablesHandler->getVariable('global.workflow.title'),
            $message
        );
    }

    private function addDebugLogMessage(string $message, ...$args): void
    {
        $this->logger->debug($this->prepareLogMessage($message, ...$args));
    }

    public function setup(
        array $step,
        callable $actionCallback
    ): void {
        $this->addDebugLogMessage(
            'Setting up step %1$s',
            $step['node']['data']['slug']
        );

        call_user_func($actionCallback, $step);

        $this->runNextSteps($step);
    }

    public function runNextSteps(array $step): void
    {
        $nextSteps = $this->getNextSteps($step);

        $this->addDebugLogMessage(
            'Running next steps after %1$s',
            $step['node']['data']['slug']
        );

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep);
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
}
