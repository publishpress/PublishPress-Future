<?php

namespace PublishPress\Future\Modules\Workflows\Infrastructure\Safety;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowExecutionSafeguardInterface;
use PublishPress\Future\Modules\Workflows\TransientsAbstract;

class WorkflowExecutionSafeguard implements WorkflowExecutionSafeguardInterface
{
    /**
     * @var HookableInterface
     */
    private HookableInterface $hooks;

    /**
     * @var array
     */
    private array $runningNodes = [];

    public function __construct(
        HookableInterface $hooks
    ) {
        $this->hooks = $hooks;
    }

    public function detectInfiniteLoop(int $workflowId, array $step, string $uniqueId = ''): bool
    {
        $stepId = $step['node']['id'];
        $executionKey = sprintf('%s-%s-%s', $workflowId, $stepId, $uniqueId);

        $infiniteLoopDetected = in_array($executionKey, $this->runningNodes);
        $this->runningNodes[] = $executionKey;

        return $infiniteLoopDetected;
    }

    /**
     * Check if a step was recently processed within the threshold
     *
     * Requires the class have a logger and stepProcessor property.
     *
     * @param string $uniqueId
     * @return bool True if the step should be skipped (was recently processed)
     */
    public function preventDuplicateExecution(string $uniqueId): bool
    {
        $duplicatePreventionThreshold = $this->getDuplicatePreventionThreshold();
        $currentTimestamp = microtime(true);

        /**
         * Transients are probably not the most performant way to do this, but we need something
         * that persists across requests. Block editor or third party plugins are firing save_post
         * actions multiple times.
         */
        $lastProcessedTime = get_transient(TransientsAbstract::TRANSIENT_DUPLICATE_PREVENTION . $uniqueId);

        if ($lastProcessedTime) {
            return true;
        }

        set_transient(
            TransientsAbstract::TRANSIENT_DUPLICATE_PREVENTION . $uniqueId,
            $currentTimestamp,
            $duplicatePreventionThreshold
        );

        return false;
    }

    /**
     * Get the duplicate prevention threshold in seconds
     *
     * This defines how long we should wait before allowing the same step to be processed again
     *
     * @return int Threshold in seconds
     */
    protected function getDuplicatePreventionThreshold(): int
    {
        return $this->hooks->applyFilters(
            HooksAbstract::FILTER_DUPLICATE_PREVENTION_THRESHOLD,
            2
        );
    }

    public function generateUniqueExecutionIdentifier(array $elements): string
    {
        return md5(implode('-', $elements));
    }
}
