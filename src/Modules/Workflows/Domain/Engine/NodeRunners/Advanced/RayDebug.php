<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug as NodeTypeRayDebug;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class RayDebug implements NodeRunnerInterface
{
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

    public function __construct(
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
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
        $this->nodeRunnerProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

                if (! function_exists('ray')) {
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
                $customData = $nodeSettings['data']['customData'] ?? '';

                if ($dataToOutput === 'all-input') {
                    $onlyInputVariables = $this->variablesHandler->getAllVariables();
                    unset($onlyInputVariables['global']);

                    $output = $onlyInputVariables;
                } else {
                    if ($dataToOutput === 'custom-data') {
                        $output = $this->variablesHandler->replacePlaceholdersInText($customData);
                    } else {
                        $output = $this->variablesHandler->getVariable($dataToOutput);
                    }
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
