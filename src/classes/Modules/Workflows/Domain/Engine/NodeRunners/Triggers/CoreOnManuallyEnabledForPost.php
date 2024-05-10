<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnManuallyEnabledForPost as NodeTypeCoreOnManuallyEnabledForPost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
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
     * @var array
     */
    private $node;

    /**
     * @var array
     */
    private $routineTree;

    /**
     * @var array
     */
    private $eventArgs;

    /**
     * @var array
     */
    private $globalVariables;

    /**
     * @var int
     */
    private $workflowId;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(int $workflowId, array $node, array $routineTree = [], array $globalVariables = []): void
    {
        $this->node = $node;
        $this->routineTree = $routineTree;
        $this->globalVariables = $globalVariables;
        $this->workflowId = $workflowId;

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        // Get next nodes in the routine tree
        $nextSteps = [];
        if (isset($this->routineTree['next']['output'])) {
            $nextSteps = $this->routineTree['next']['output'];
        }

        if (empty($nextSteps)) {
            return false;
        }

        // Decide we should proceed with the next nodes based on the trigger settings
        if (! $this->hasValidPostType($post)) {
            return false;
        }

        if (! $this->hasValidPostId($postId)) {
            return false;
        }

        if (! $this->hasValidPostStatus($post)) {
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

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $output, $this->globalVariables);
        }
    }

    private function hasValidPostType($post)
    {
        $settingPostTypes = $this->node['data']['settings']['postQuery']['postType'] ?? [];

        if (!empty($settingPostTypes) && !in_array($post->post_type, $settingPostTypes)) {
            return false;
        }

        return true;
    }

    private function hasValidPostId($postId)
    {
        $settingPostIds = $this->node['data']['settings']['postQuery']['postIds'] ?? [];

        if (!empty($settingPostIds) && !in_array($postId, $settingPostIds)) {
            return false;
        }

        return true;
    }

    private function hasValidPostStatus($post)
    {
        $settingPostStatus = $this->node['data']['settings']['postQuery']['postStatus'] ?? [];

        if (!empty($settingPostStatus) && !in_array($post->post_status, $settingPostStatus)) {
            return false;
        }

        return true;
    }
}
