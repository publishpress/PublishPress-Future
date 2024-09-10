<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\Traits;

trait InfiniteLoopPreventer
{
    /**
     * @var array
     */
    protected $isRunningOnNodes = [];

    protected function isInfinityLoopDetected(int $workflowId, array $step): bool
    {
        $stepId = $step['node']['id'];

        $infiniteLoopIndex = sprintf('%s-%s', $workflowId, $stepId);

        $isAlreadyRunning = in_array($infiniteLoopIndex, $this->isRunningOnNodes);
        $this->isRunningOnNodes[] = $infiniteLoopIndex;

        return $isAlreadyRunning;
    }
}
