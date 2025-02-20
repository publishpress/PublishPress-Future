<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\InputValidators;

use PublishPress\Future\Modules\Workflows\Interfaces\InputValidatorsInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Module;

class PostQuery implements InputValidatorsInterface
{
    private RuntimeVariablesHandlerInterface $runtimeVariablesHandler;

    public function __construct(RuntimeVariablesHandlerInterface $runtimeVariablesHandler)
    {
        $this->runtimeVariablesHandler = $runtimeVariablesHandler;
    }

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

        if (! $this->hasValidPostAuthor($post, $nodeSettings)) {
            return false;
        }

        if (! $this->hasValidPostTerms($post, $nodeSettings)) {
            return false;
        }

        return true;
    }

    private function hasValidPostType($post, array $nodeSettings)
    {
        if (! is_object($post)) {
            return false;
        }

        // Prevent to apply actions to workflows
        if ($post->post_type === Module::POST_TYPE_WORKFLOW) {
            return false;
        }

        $settingPostTypes = $nodeSettings['postQuery']['postType'] ?? [];

        // Invalidate nodes that don't specify a post type to avoid applying actions to all post types
        if (empty($settingPostTypes)) {
            return false;
        }

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

    private function hasValidPostAuthor($post, array $nodeSettings)
    {
        $settingPostAuthor = $nodeSettings['postQuery']['postAuthor'] ?? [];

        if (empty($settingPostAuthor)) {
            return true;
        }

        $settingPostAuthor = $this->runtimeVariablesHandler->resolveExpressionsInArray($settingPostAuthor);

        return in_array($post->post_author, $settingPostAuthor);
    }

    private function hasValidPostTerms($post, array $nodeSettings)
    {
        $settingPostTerms = $nodeSettings['postQuery']['postTerms'] ?? [];

        if (empty($settingPostTerms)) {
            return true;
        }

        $settingPostTerms = $this->runtimeVariablesHandler->resolveExpressionsInArray($settingPostTerms);

        $groupedSelectedTerms = [];

        foreach ($settingPostTerms as $term) {
            $termParts = explode(':', $term);

            if (count($termParts) !== 2) {
                continue;
            }

            if (!isset($groupedSelectedTerms[$termParts[0]])) {
                $groupedSelectedTerms[$termParts[0]] = [];
            }

            $groupedSelectedTerms[$termParts[0]][] = (int)$termParts[1];
        }

        foreach ($groupedSelectedTerms as $taxonomy => $termIds) {
            $postTerms = wp_get_post_terms($post->ID, $taxonomy, ['fields' => 'ids']);

            if (is_wp_error($postTerms)) {
                return false;
            }

            if (count(array_intersect($postTerms, $termIds)) > 0) {
                return true;
            }
        }

        return false;
    }
}
