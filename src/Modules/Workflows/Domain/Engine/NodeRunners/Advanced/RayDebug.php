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

                $expression = '';
                if (isset($nodeSettings['data']['expression'])) {
                    $expression = $nodeSettings['data']['expression'];
                } else {
                    if (isset($nodeSettings['data']['dataToOutput'])) {
                        $expression = '{{' . $nodeSettings['data']['dataToOutput'] . '}}';

                        if ($expression === '{{all-input}}') {
                            $expression = '{{input}}';
                        }
                    }

                    if (isset($nodeSettings['data']['customData'])) {
                        $expression = $nodeSettings['data']['customData'];
                    }
                }

                if ($expression === '{{input}}') {
                    $output = $this->variablesHandler->getAllVariables();
                    unset($output['global']);
                } else {
                    $output = $this->variablesHandler->replacePlaceholdersInText($expression);
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
