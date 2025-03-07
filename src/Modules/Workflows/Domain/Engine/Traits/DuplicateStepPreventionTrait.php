<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\Traits;

use PublishPress\Future\Modules\Workflows\HooksAbstract;

trait DuplicateStepPreventionTrait
{
    /**
     * @var array Stores last processed timestamp for each post ID
     */
    private $lastProcessedTime = [];

    /**
     * Check if a step was recently processed within the threshold
     *
     * Requires the class have a logger and stepProcessor property.
     *
     * @param string $uniqueId
     * @param string $shortDescription
     * @return bool True if the step should be skipped (was recently processed)
     */
    protected function shouldPreventDuplicateProcessing(string $uniqueId, string $shortDescription = ''): bool
    {
        $processThreshold = $this->getProcessThreshold();
        $currentTime = microtime(true);

        if (isset($this->lastProcessedTime[$uniqueId])) {
            $timeDiff = $currentTime - $this->lastProcessedTime[$uniqueId];

            if ($timeDiff < $processThreshold) {
                if (method_exists($this, 'logger') && method_exists($this, 'stepProcessor')) {
                    $this->logger->debug(
                        $this->stepProcessor->prepareLogMessage(
                            'Skipping duplicate step, processed %.2f seconds ago. UID: %s: %s',
                            $timeDiff,
                            $uniqueId,
                            $shortDescription
                        )
                    );
                }
                return true;
            }
        }

        $this->lastProcessedTime[$uniqueId] = $currentTime;
        return false;
    }

    /**
     * Get the process threshold in seconds
     *
     * @return int
     */
    protected function getProcessThreshold(): int
    {
        return $this->hooks->applyFilters(HooksAbstract::FILTER_DUPLICATE_PREVENTION_THRESHOLD, 2);
    }
}
