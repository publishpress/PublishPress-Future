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

    public function setup(array $step, array $input = []): void
    {
        $node = $step['node'];
        $nextSteps = $step['next']['output'];
        $nodeSettings = $node['data']['settings'];

        // What to output?
        try {
            $dataToOutput = explode('.', $nodeSettings['data']['dataToOutput']);
            $messageToSend = null;

            $messageToSend = $input;

            if (count($dataToOutput) > 1 && $dataToOutput[0] !== 'all-input') {
                foreach ($dataToOutput as $key) {
                    if (is_array($messageToSend) && isset($messageToSend[$key])) {
                        $messageToSend = $messageToSend[$key];
                    } else {
                        if (is_object($messageToSend) && isset($messageToSend->{$key})) {
                            $messageToSend = $messageToSend->{$key};
                        } else {
                            throw new Exception('Invalid data key: ' . $key . ' for data: ' . $input);
                        }
                    }
                }
            } else {
                if (count($dataToOutput) === 1) {
                    $messageToSend = $input[$dataToOutput[0]];
                }
            }
        } catch (\Exception $e) {
            $messageToSend = 'Error: ' . $e->getMessage();
        }

        $rayMessage = ray($messageToSend);

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
