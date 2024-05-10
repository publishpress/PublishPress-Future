<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunnerPreparers;

use Exception;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerPreparerInterface;
use WpOrg\Requests\Hooks;

class PostAction implements NodeRunnerPreparerInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var NodeRunnerPreparerInterface
     */
    private $generalNodeRunnerPreparer;

    public function __construct(HooksFacade $hooks, NodeRunnerPreparerInterface $generalNodeRunnerPreparer)
    {
        $this->hooks = $hooks;
        $this->generalNodeRunnerPreparer = $generalNodeRunnerPreparer;
    }

    public function setup(array $step, callable $actionCallback, array $input = [], array $globalVariables = []): void
    {
        try {
            $node = $this->getNodeFromStep($step);
            $nodeSettings = $this->getNodeSettings($node);
            $workflowId = $this->getWorkflowIdFromGlobalVariables($globalVariables);

            if (empty($nodeSettings)) {
                throw new Exception('Node has empty settings');
            }

            if (empty($input)) {
                throw new Exception('Node has empty input');
            }

            $postSource = $nodeSettings['postQuery']['postSource'] ?? '';

            if (empty($postSource)) {
                throw new Exception('No post source defined');
            }

            $posts = [];
            if ($postSource === 'input') {
                $posts = [$this->getPostFromInput($input)];
            } else {
                $posts = $this->getPostsFromQuery($nodeSettings);
            }

            // No post found
            if (empty($posts)) {
                return;
            }

            foreach ($posts as $post) {
                if (is_array($post)) {
                    $postId = $post['post_id'];
                } else {
                    $postId = $post->ID;
                }

                call_user_func($actionCallback, $postId, $nodeSettings);
            }

            $this->runNextSteps($step, $input, $globalVariables);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function runNextSteps(array $step, array $input, array $globalVariables): void
    {
        $this->generalNodeRunnerPreparer->runNextSteps($step, $input, $globalVariables);
    }

    public function getNextSteps(array $step)
    {
        return $this->generalNodeRunnerPreparer->getNextSteps($step);
    }

    public function getNodeFromStep(array $step)
    {
        return $this->generalNodeRunnerPreparer->getNodeFromStep($step);
    }

    public function getNodeSettings(array $node)
    {
        return $this->generalNodeRunnerPreparer->getNodeSettings($node);
    }

    public function getWorkflowIdFromGlobalVariables(array $globalVariables)
    {
        return $this->generalNodeRunnerPreparer->getWorkflowIdFromGlobalVariables($globalVariables);
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->generalNodeRunnerPreparer->logError($message, $workflowId, $step);
    }

    private function getPostFromInput(array $input)
    {
        $postInputNames = $this->getPostInputNames($input);

        if (empty($postInputNames)) {
            throw new Exception('No post input found');
        }

        return $input[$postInputNames[0]];
    }

    private function getPostsFromQuery(array $nodeSettings)
    {
        // Post Type
        $postType = $nodeSettings['postQuery']['postType'] ?? false;
        $postQuery = [
            'posts_per_page' => -1,
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

    private function getPostInputNames(array $input): array
    {
        $postInputIndexes = [];

        foreach ($input as $name => $value) {
            if (is_array($value) && isset($value['post_id'])) {
                $postInputIndexes[] = $name;
                continue;
            }

            if (is_object($value) && get_class($value) === 'WP_Post') {
                $postInputIndexes[] = $name;
                continue;
            }
        }

        return $postInputIndexes;
    }
}
