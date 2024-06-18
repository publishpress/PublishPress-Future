<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\RayDebug as NodeTypeRayDebug;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class RayDebug implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeRayDebug::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'actionCallback'], $contextVariables);
    }

    public function actionCallback(array $step, array $contextVariables)
    {
        if (! function_exists('ray')) {
            $workflowId = $contextVariables['global']['workflow']['id'];

            $this->nodeRunnerPreparer->logError(
                'Ray is not installed. Please install it from the WordPress plugins directory',
                $workflowId,
                $step
            );
            return;
        }

        $output = null;
        try {
            $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);

            $dataToOutput = $nodeSettings['data']['dataToOutput'] ?? 'all-input';

            if ($dataToOutput === 'all-input') {
                $onlyInputVariables = $contextVariables;
                unset($onlyInputVariables['global']);

                $output = $onlyInputVariables;
            } else {
                $output = $this->nodeRunnerPreparer->getVariableValueFromContextVariables(
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
