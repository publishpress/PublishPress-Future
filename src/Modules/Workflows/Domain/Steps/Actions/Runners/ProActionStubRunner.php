<?php

/**
 * Shared skip behavior for Pro-only action step runners.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

/**
 * Logs a Pro skip for action runners that do no free-plugin work.
 *
 * The general step processor calls the callback with the step. The post
 * step processor calls it with the post ID, node settings, and the step.
 *
 * @since 4.3.1
 */
abstract class ProActionStubRunner implements StepRunnerInterface
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
     * @param array $step
     * @return void
     * @since 4.3.1
     */
    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    /**
     * @param int|array|null $postId
     * @param array|null     $nodeSettings
     * @param array|null     $step
     * @return void
     * @since 4.3.1
     */
    public function setupCallback($postId = null, $nodeSettings = null, $step = null): void
    {
        if (! is_array($step)) {
            $step = is_array($postId) ? $postId : $nodeSettings;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $this->logger->debugWithArgs(
                    'Step %1$s is a Pro feature, skipping',
                    $this->stepProcessor->getSlugFromStep($step)
                );
            }
        );
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
