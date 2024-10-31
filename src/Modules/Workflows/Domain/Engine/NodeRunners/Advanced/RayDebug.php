<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug as NodeTypeRayDebug;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowEngineInterface;
use Throwable;

class RayDebug implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var WorkflowEngineInterface
     */
    private $engine;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger,
        WorkflowEngineInterface $engine
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
        $this->engine = $engine;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeRayDebug::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(array $step)
    {
        $this->engine->executeStep(
            $step,
            function ($step) {
                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                if (! function_exists('ray')) {
                    $workflowId = $this->variablesHandler->getVariable('global.workflow.id');

                    $this->logger->error(
                        $this->nodeRunnerProcessor->prepareLogMessage(
                            'Ray is not installed. Skipping step %s',
                            $nodeSlug
                        )
                    );

                    return;
                }

                $output = null;
                $node = $this->nodeRunnerProcessor->getNodeFromStep($step);
                $nodeSettings = $this->nodeRunnerProcessor->getNodeSettings($node);

                $dataToOutput = $nodeSettings['data']['dataToOutput'] ?? 'all-input';

                if ($dataToOutput === 'all-input') {
                    $onlyInputVariables = $this->variablesHandler->getAllVariables();
                    unset($onlyInputVariables['global']);

                    $output = $onlyInputVariables;
                } else {
                    $output = $this->variablesHandler->getVariable($dataToOutput);
                }

                // phpcs:ignore PublishPressStandards.Debug.DisallowDebugFunctions.FoundRayFunction
                $rayMessage = ray($output);

                if (isset($nodeSettings['label'])) {
                    $rayMessage->label($nodeSettings['label']);
                }

                if (isset($nodeSettings['color'])) {
                    switch ($nodeSettings['color']) {
                        case 'red':
                            $rayMessage->red();
                            break;
                        case 'green':
                            $rayMessage->green();
                            break;
                        case 'blue':
                            $rayMessage->blue();
                            break;
                        case 'purple':
                            $rayMessage->purple();
                            break;
                        case 'orange':
                            $rayMessage->orange();
                            break;
                        case 'gray':
                            $rayMessage->gray();
                            break;
                    }
                }

                $this->logger->debug(
                    $this->nodeRunnerProcessor->prepareLogMessage(
                        'Step completed | Slug: %s',
                        $nodeSlug
                    )
                );
            }
        );
    }
}
