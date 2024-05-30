<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced\CorePostQuery as NodeType;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;

class CorePostQuery implements NodeRunnerInterface
{
    public const NODE_NAME = NodeType::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $nodeRunnerPreparer;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerPreparerInterface $nodeRunnerPreparer
    ) {
        $this->hooks = $hooks;
        $this->nodeRunnerPreparer = $nodeRunnerPreparer;
    }

    public function setup(array $step, array $contextVariables = []): void
    {
        try {
            $node = $this->nodeRunnerPreparer->getNodeFromStep($step);
            $nodeSettings = $this->nodeRunnerPreparer->getNodeSettings($node);
            $workflowId = $this->nodeRunnerPreparer->getWorkflowIdFromContextVariables($contextVariables);
            $nodeSlug = $this->nodeRunnerPreparer->getSlugFromStep($step);

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

            $this->nodeRunnerPreparer->runNextSteps($step, $contextVariables);
        } catch (\Exception $e) {
            $this->nodeRunnerPreparer->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function actionCallback(int $postId, array $nodeSettings)
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
