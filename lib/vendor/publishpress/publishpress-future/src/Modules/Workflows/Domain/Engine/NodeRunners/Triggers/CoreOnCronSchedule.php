<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnCronSchedule as NodeType;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\AsyncNodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnCronSchedule implements NodeTriggerRunnerInterface
{
    /**
     * The default interval in seconds that the setup should be skipped.
     *
     * @var int
     */
    public const DEFAULT_SETUP_INTERVAL = 5;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $contextVariables;

    /**
     * @var int
     */
    private $workflowId;

    /**
     * @var AsyncNodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    public function __construct(
        HookableInterface $hooks,
        AsyncNodeRunnerProcessorInterface $nodeRunnerProcessor
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step, array $contextVariables = []): void
    {
        $this->step = $step;
        $this->contextVariables = $contextVariables;
        $this->workflowId = $workflowId;

        if ($this->shouldSetup()) {
            $this->nodeRunnerProcessor->setup($this->step, '__return_true', $this->contextVariables);
        }
    }

    /**
     * Check if the setup should be skipped, to avoid checking this on every request.
     *
     * @return bool
     */
    private function shouldSetup(): bool
    {
        if (empty($this->step)) {
            return false;
        }

        $transientKey = 'publishpressfuture_coreoncronschedule_setup_'
            . $this->workflowId
            . '_'
            . $this->step['node']['id'];

        /**
         * @param int $defaultTimeout
         *
         * @return int
         */
        $transientTimeout = apply_filters(
            HooksAbstract::FILTER_CRON_SCHEDULE_RUNNER_TRANSIENT_TIMEOUT,
            self::DEFAULT_SETUP_INTERVAL
        );

        if (get_transient($transientKey)) {
            return false;
        }

        set_transient($transientKey, true, $transientTimeout);

        return true;
    }

    public function actionCallback(array $compactedArgs, array $originalArgs)
    {
        $expandedArgs = $this->nodeRunnerProcessor->expandArguments($compactedArgs);

        $this->step = $expandedArgs['step'];
        $this->contextVariables = $expandedArgs['contextVariables'];
        $this->workflowId = $this->nodeRunnerProcessor->getWorkflowIdFromContextVariables($this->contextVariables);


        $this->nodeRunnerProcessor->triggerCallbackIsRunning($this->contextVariables);
        $this->nodeRunnerProcessor->actionCallback($compactedArgs, $originalArgs);
    }
}
