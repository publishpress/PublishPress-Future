<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeTypeCoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnManuallyEnabledForPost implements NodeTriggerRunnerInterface
{
    const NODE_NAME = NodeTypeCoreOnManuallyEnabledForPost::NODE_NAME;

    const META_KEY_MANUALLY_ENABLED = '_workflow_manually_enabled_';

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    /**
     * @var array
     */
    private $step;

    /**
     * @var array
     */
    private $globalVariables;

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

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        $postQueryArgs = [
            'post' => $post,
            'node' => $this->step['node'],
        ];

        if (! $this->postQueryValidator->validate($postQueryArgs)) {
            return false;
        }

        // Look for the metadata that indicates the post was manually enabled
        $manuallyEnabled = (bool)get_post_meta($postId, self::META_KEY_MANUALLY_ENABLED . $this->workflowId, true);
        if (! $manuallyEnabled) {
            return false;
        }

        $output = [
            'postId' => $postId,
            'post' => $post,
            'update' => $update,
        ];

        $this->nodeRunnerPreparer->runNextSteps($this->step, $output, $this->globalVariables);
    }
}
