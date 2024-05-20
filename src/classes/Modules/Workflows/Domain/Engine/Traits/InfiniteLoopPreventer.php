<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\Traits;

trait InfiniteLoopPreventer
{
    /**
     * @var bool
     */
    protected $isRunning = false;

    protected function isInfinityLoopDetected(): bool
    {
        $isAlreadyRunning = $this->isRunning;
        $this->isRunning = true;

        return $isAlreadyRunning;
    }
}
