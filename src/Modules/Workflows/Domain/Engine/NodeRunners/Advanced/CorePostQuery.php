<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class CorePostQuery implements NodeRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        try {
            $node = $this->nodeRunnerProcessor->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerProcessor->getNodeSettings($node);
            $workflowId = $this->nodeRunnerProcessor->getWorkflowIdFromContextVariables($contextVariables);
            $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

            if (empty($nodeSettings)) {
                throw new Exception('Node has empty settings');
            }

            $posts = $this->getPostsFromQuery($nodeSettings);

            // No post found
            if (empty($posts)) {
                return;
            }

            $contextVariables = array_merge(
                $contextVariables,
                [
                    $nodeSlug => [
                        'posts' => array_map('intval', $posts),
                    ],
                ]
            );

            $this->nodeRunnerProcessor->runNextSteps($step, $contextVariables);
        } catch (\Exception $e) {
            $this->nodeRunnerProcessor->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function actionCallback(int $postId, array $nodeSettings, array $step, array $contextVariables)
    {
        // TODO: Do we need anything here? Maybe something for debugging or logging?
    }

    private function getPostsFromQuery(array $nodeSettings)
    {
        // Post Type
        $postType = $nodeSettings['postQuery']['postType'] ?? false;
        $postQuery = [
            'posts_per_page' => -1,
            'post_status' => 'any',
            'fields' => 'ids',
        ];
        if (! empty($postType)) {
            $postQuery['post_type'] = $postType;
        }

        // Post ID
        $postId = $nodeSettings['postQuery']['postId'] ?? false;
        if (! empty($postId)) {
            if (! is_array($postId)) {
                $postId = [$postId];
            }

            $postId = array_map('intval', $postId);

            $postQuery['post__in'] = $postId;
        }

        // Post Status
        $postStatus = $nodeSettings['postQuery']['postStatus'] ?? false;
        if (! empty($postStatus)) {
            $postQuery['post_status'] = $postStatus;
        }

        return get_posts($postQuery);
    }
}
