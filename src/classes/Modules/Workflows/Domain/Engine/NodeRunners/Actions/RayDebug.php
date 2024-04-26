<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

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

    public function setup(array $step)
    {
        $node = $step['node'];
        $nextSteps = $step['next']['output'];
        $nodeSettings = $node['data']['settings'];

        $rayMessage = ray('Hello world!');

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
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep);
        }
    }
}
