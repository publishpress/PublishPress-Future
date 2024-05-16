<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnPostUpdated as NodeTypeCoreOnPostUpdated;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnPostUpdated implements NodeTriggerRunnerInterface
{
    public const NODE_NAME = NodeTypeCoreOnPostUpdated::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $globalVariables;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var InputValidatorsInterface
     */
    private $postQueryValidator;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer,
        InputValidatorsInterface $postQueryValidator
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
        $this->postQueryValidator = $postQueryValidator;
    }

    public function setup(int $workflowId, array $step, array $globalVariables = []): void
    {
        $this->step = $step;
        $this->globalVariables = $globalVariables;

        $this->hooks->addAction(HooksAbstract::ACTION_POST_UPDATED, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $postAfter, $postBefore)
    {
        $postQueryArgs = [
            'post' => $postBefore,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        $output = [
            'postId' => $postId,
            'postBefore' => $postBefore,
            'postAfter' => $postAfter,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $output, $this->globalVariables);
    }
}
