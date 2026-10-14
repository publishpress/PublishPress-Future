<?php

/**
 * Builds a workflow step runner for a node type.
 *
 * @package     PublishPress\Future
 * @author      PublishPress
 * @copyright   Copyright (c) 2026, PublishPress
 * @license     GPLv2 or later
 */

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Core\DI\ContainerInterface;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Modules\Workflows\HooksAbstract;

/**
 * Resolves a step runner from the core registry and the map filters.
 *
 * Pro and other extensions can replace a runner via
 * FILTER_WORKFLOW_ENGINE_MAP_STEP_RUNNER. When that filter does not return
 * an object, the core registry builds the runner and
 * FILTER_WORKFLOW_ENGINE_MAP_TRIGGER still runs.
 *
 * @since 4.3.1
 */
class StepRunnerFactory
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var CoreStepRegistry
     */
    private $registry;

    /**
     * @param ContainerInterface $container
     * @param CoreStepRegistry   $registry
     * @since 4.3.1
     */
    public function __construct(ContainerInterface $container, CoreStepRegistry $registry)
    {
        $this->container = $container;
        $this->registry = $registry;
    }

    /**
     * @param string $nodeName
     * @param string $workflowExecutionId
     * @return object|null
     * @since 4.3.1
     */
    public function create($nodeName, $workflowExecutionId)
    {
        $hooks = $this->container->get(ServicesAbstract::HOOKS);

        $executionContext = $this->container->get(ServicesAbstract::EXECUTION_CONTEXT_REGISTRY)
            ->getExecutionContext($workflowExecutionId);

        $stepRunner = $hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_STEP_RUNNER,
            null,
            $nodeName,
            $workflowExecutionId
        );

        if (is_object($stepRunner)) {
            return $stepRunner;
        }

        $workflowLogger = call_user_func(
            $this->container->get(ServicesAbstract::WORKFLOW_LOGGER_FACTORY),
            $executionContext
        );
        $settingsModel = $this->container->get(ServicesAbstract::SETTINGS);

        $generalStepProcessor = call_user_func(
            $this->container->get(ServicesAbstract::GENERAL_STEP_PROCESSOR_FACTORY),
            $workflowExecutionId
        );

        $experimentalEnabled = false;

        if ($this->registry->runnerUsesExperimentalGate($nodeName)) {
            $experimentalEnabled = (bool) $settingsModel->getExperimentalFeaturesStatus();
        }

        if ($this->registry->shouldBuildRunner($nodeName, $experimentalEnabled)) {
            $stepRunner = $this->registry->buildRunner(
                $nodeName,
                [
                    'container' => $this->container,
                    'workflowExecutionId' => $workflowExecutionId,
                    'executionContext' => $executionContext,
                    'workflowLogger' => $workflowLogger,
                    'generalStepProcessor' => $generalStepProcessor,
                    'hooks' => $hooks,
                ]
            );
        }

        return $hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ENGINE_MAP_TRIGGER,
            $stepRunner,
            $nodeName,
            $executionContext
        );
    }
}
