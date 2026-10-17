<?php

/**
 * Shared skip behavior for Pro-only trigger step runners.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;

/**
 * Logs a Pro skip for trigger runners that do no free-plugin work.
 *
 * @since 4.3.1
 */
abstract class ProTriggerStubRunner implements TriggerRunnerInterface
{
    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var string
     */
    private $nodeTypeName;

    /**
     * @param StepProcessorInterface $stepProcessor
     * @param LoggerInterface        $logger
     * @param string                 $nodeTypeName
     * @since 4.3.1
     */
    public function __construct(
        StepProcessorInterface $stepProcessor,
        LoggerInterface $logger,
        string $nodeTypeName
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
        $this->nodeTypeName = $nodeTypeName;
    }

    /**
     * Static so legacy aliases can read the name before construction.
     * Subclasses return the definition name passed into the constructor.
     *
     * @return string
     * @since 4.3.1
     */
    abstract public static function getNodeTypeName(): string;

    /**
     * @param int   $workflowId
     * @param array $step
     * @return void
     * @since 4.3.1
     */
    public function setup(int $workflowId, array $step): void
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                if ($this->shouldRunStepSetup()) {
                    $this->stepProcessor->setup($step, '__return_true');
                }

                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $this->logger->debugWithArgs('Step %1$s is a Pro feature, skipping', $nodeSlug);
            }
        );
    }

    /**
     * Most Pro trigger stubs mark the step handled before logging the skip.
     * OnInit, OnAdminInit, and OnCustomAction only log.
     *
     * @return bool
     * @since 4.3.1
     */
    protected function shouldRunStepSetup(): bool
    {
        return true;
    }

    /**
     * @return string
     * @since 4.3.1
     */
    protected function getConstructedNodeTypeName(): string
    {
        return $this->nodeTypeName;
    }
}
