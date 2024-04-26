<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Triggers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Triggers\CoreOnSavePost as NodeTypeCoreOnSavePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTriggerRunnerInterface;

class CoreOnSavePost implements NodeTriggerRunnerInterface
{
    public const NODE_NAME = NodeTypeCoreOnSavePost::NODE_NAME;

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

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function setup(array $node, array $routineTree = [])
    {
        $this->node = $node;
        $this->routineTree = $routineTree;

        $this->hooks->addAction(HooksAbstract::ACTION_SAVE_POST, [$this, 'triggerCallback'], 10, 3);
    }

    public function triggerCallback($postId, $post, $update)
    {
        // Get next nodes in the routine tree
        $nextSteps = $this->routineTree['next']['output'];

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

        $output = [
            'postId' => $postId,
            'post' => $post,
            'update' => $update,
        ];

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $output);
        }
    }

    private function hasValidPostType($post)
    {
        $settingPostTypes = $this->node['data']['settings']['post_query']['postType'] ?? [];

        if (!empty($settingPostTypes) && !in_array($post->post_type, $settingPostTypes)) {
            return false;
        }

        return true;
    }

    private function hasValidPostId($postId)
    {
        $settingPostIds = $this->node['data']['settings']['post_query']['postIds'] ?? [];

        if (!empty($settingPostIds) && !in_array($postId, $settingPostIds)) {
            return false;
        }

        return true;
    }

    private function hasValidPostStatus($post)
    {
        $settingPostStatus = $this->node['data']['settings']['post_query']['postStatus'] ?? [];

        if (!empty($settingPostStatus) && !in_array($post->post_status, $settingPostStatus)) {
            return false;
        }

        return true;
    }
}
