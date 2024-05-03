<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\RayDebug as NodeTypeRayDebug;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;

class RayDebug implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeRayDebug::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(array $step, array $input = [], array $globalVariables = []): void
    {
        $node = $step['node'];
        $nextSteps = [];
        if (isset($step['next']['output'])) {
            $nextSteps = $step['next']['output'];
        }
        $nodeSettings = [];
        if (isset($node['data']['settings'])) {
            $nodeSettings = $node['data']['settings'];
        }

        // What to output?
        try {
            $dataToOutput = [];
            if (isset($nodeSettings['data']['dataToOutput'])) {
                $dataToOutput = explode('.', $nodeSettings['data']['dataToOutput']);
            }

            $dataSource = null;
            if (isset($dataToOutput[0]) && $dataToOutput[0] === 'all-input') {
                $dataSource = 'input';
            } else if (isset($input[$dataToOutput[0]])) {
                $dataSource = 'input';
            } else if (isset($globalVariables[$dataToOutput[0]])) {
                $dataSource = 'global';
            }

            if (! $dataSource) {
                throw new Exception('Invalid data key: ' . $dataToOutput[0] . ' for data: ' . $input);
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
                            throw new Exception('Invalid data key: ' . $variablePart . ' for data: ' . $sourceVariable);
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

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $input);
        }
    }
}
