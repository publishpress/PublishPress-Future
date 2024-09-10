<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug as NodeTypeRayDebug;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

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

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeRayDebug::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerProcessor->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(array $step, array $contextVariables)
    {
        if (! function_exists('ray')) {
            $workflowId = $contextVariables['global']['workflow']['id'];

            $this->nodeRunnerProcessor->logError(
                'Ray is not installed. Please install it from the WordPress plugins directory',
                $workflowId,
                $step
            );
            return;
        }

        $output = null;
        try {
            $node = $this->nodeRunnerProcessor->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerProcessor->getNodeSettings($node);

            $dataToOutput = $nodeSettings['data']['dataToOutput'] ?? 'all-input';

            if ($dataToOutput === 'all-input') {
                $onlyInputVariables = $contextVariables;
                unset($onlyInputVariables['global']);

                $output = $onlyInputVariables;
            } else {
                $output = $this->nodeRunnerProcessor->getVariableValueFromContextVariables(
                    $dataToOutput,
                    $contextVariables
                );
            }
        } catch (\Exception $e) {
            $output = 'Error: ' . $e->getMessage();
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
    }
}
