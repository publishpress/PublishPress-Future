<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\RayDebug as NodeTypeRayDebug;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class RayDebug implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeRayDebug::NODE_NAME;

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

    public function setup(array $step, array $input = [], array $globalVariables = []): void
    {
        $this->nodeRunnerPreparer->setup($step, [$this, 'actionCallback'], $input, $globalVariables);
    }

    public function actionCallback(array $step, array $input, array $globalVariables)
    {
        if (! function_exists('ray')) {
            $workflowId = $this->nodeRunnerPreparer->getWorkflowIdFromGlobalVariables($globalVariables);

            $this->nodeRunnerPreparer->logError(
                'Ray is not installed. Please install it from the WordPress plugins directory',
                $workflowId,
                $step
            );
            return;
        }

        try {
            $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);

            $dataToOutput = [];
            if (isset($nodeSettings['data']['dataToOutput'])) {
                $dataToOutput = explode('.', $nodeSettings['data']['dataToOutput']);
            }

            $dataSource = 'input';
            if ($dataToOutput[0] === 'global') {
                $dataSource = 'global';
                $dataToOutput = array_slice($dataToOutput, 1);
            }

            $sourceVariable = $dataSource === 'input' ? $input : $globalVariables;

            $rayMessage = $sourceVariable;

            if (count($dataToOutput) > 1 && $dataToOutput[0] !== 'all-input') {
                foreach ($dataToOutput as $variablePart) {
                    if (is_array($rayMessage) && isset($rayMessage[$variablePart])) {
                        $rayMessage = $rayMessage[$variablePart];
                    } else {
                        if (is_object($rayMessage) && isset($rayMessage->{$variablePart})) {
                            $rayMessage = $rayMessage->{$variablePart};
                        } else {
                            throw new Exception('Invalid data key: ' . $variablePart . ' for data: ' . print_r($sourceVariable, true));
                        }
                    }
                }
            } else {
                if (count($dataToOutput) === 1 && $dataToOutput[0] === 'all-input') {
                    $rayMessage = $input;
                } else if (count($dataToOutput) === 1) {
                    $rayMessage = $sourceVariable[$dataToOutput[0]];
                }
            }
        } catch (\Exception $e) {
            $rayMessage = 'Error: ' . $e->getMessage();
        }

        $rayMessage = ray($rayMessage);

        if (isset($nodeSettings['label'])) {
            $rayMessage->label($nodeSettings['label']);
        }

        if (isset($nodeSettings['color'])) {
            switch($nodeSettings['color']) {
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
