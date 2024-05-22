<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\InputValidators;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\WorkflowModel;
use PublishPress\FuturePro\Modules\Workflows\Module;

class PostQuery implements InputValidatorsInterface
{
    public function validate(array $args): bool
    {
        $post = $args['post'];
        $node = $args['node'];
        $nodeSettings = $node['data']['settings'] ?? [];

        if (! $this->hasValidPostType($post, $nodeSettings)) {
            return false;
        }

        if (! $this->hasValidPostId($post, $nodeSettings)) {
            return false;
        }

        if (! $this->hasValidPostStatus($post, $nodeSettings)) {
            return false;
        }

        return true;
    }

    private function hasValidPostType($post, array $nodeSettings)
    {
        // Prevent to apply actions to workflows
        if ($post->post_type === Module::POST_TYPE_WORKFLOW) {
            return false;
        }

        $settingPostTypes = $nodeSettings['postQuery']['postType'] ?? [];

        if (!empty($settingPostTypes) && !in_array($post->post_type, $settingPostTypes)) {
            return false;
        }

        return true;
    }

    private function hasValidPostId($postId, array $nodeSettings)
    {
        $settingPostIds = $nodeSettings['postQuery']['postIds'] ?? [];

        if (!empty($settingPostIds) && !in_array($postId, $settingPostIds)) {
            return false;
        }

        return true;
    }

    private function hasValidPostStatus($post, array $nodeSettings)
    {
        $settingPostStatus = $nodeSettings['postQuery']['postStatus'] ?? [];

        if (!empty($settingPostStatus) && !in_array($post->post_status, $settingPostStatus)) {
            return false;
        }

        return true;
    }
}
