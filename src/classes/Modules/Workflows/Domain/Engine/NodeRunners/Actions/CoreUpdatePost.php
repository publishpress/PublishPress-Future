<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Actions;

use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions\CoreUpdatePost as NodeTypeCoreUpdatePost;
use PublishPress\FuturePro\Modules\Workflows\HooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeRunnerInterface;

class CoreUpdatePost implements NodeRunnerInterface
{
    const NODE_NAME = NodeTypeCoreUpdatePost::NODE_NAME;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    public function __construct(HookableInterface $hooks, \Closure $expirablePostModelFactory)
    {
        $this->hooks = $hooks;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function setup(array $step, array $input = [], array $globalVariables = []): void
    {
        $node = $step['node'];
        $nextSteps = [];
        if (isset($step['next']['output'])) {
            $nextSteps = $step['next']['output'];
        }

        $nodeSettings = [];
        if (isset($node['data']['settings'])) {
            $nodeSettings = $node['data']['settings'];
        }

        $workflowId = $globalVariables['workflow']['id'] ?? 0;

        if (empty($nodeSettings)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PublishPress Future Pro] Node has empty settings: workflowId: $workflowId, step: " . print_r($step, true));
            }
            return;
        }

        if (empty($input)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log("[PublishPress Future Pro] Node has empty input: workflowId: $workflowId, step: " . print_r($step, true));
            }
            return;
        }

        // What to update?
        try {
            $postSource = $nodeSettings['postQuery']['postSource'] ?? '';

            if (empty($postSource)) {
                throw new Exception("No post source defined: workflowId: $workflowId, step: " . print_r($step, true));
            }

            $posts = [];
            if ($postSource === 'input') {
                $postInputNames = $this->getPostInputNames($input);

                if (empty($postInputNames)) {
                    throw new Exception("No post input found: workflowId: $workflowId, step: " . print_r($step, true));
                }

                $posts[] = $input[$postInputNames[0]];
            } else {
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

                $posts = get_posts($postQuery);
            }

            if (empty($posts)) {
                return;
            }

            $postModelFactory = $this->expirablePostModelFactory;
            foreach ($posts as $post) {
                if (is_array($post)) {
                    $postId = $post['post_id'];
                } else {
                    $postId = $post->ID;
                }

                $postModel = $postModelFactory($postId);
                // $postModel->delete(true);
                unset($postModel);
            }
        } catch (\Exception $e) {
            error_log("[PublishPress Future Pro] Error: " . $e->getMessage());
            $rayMessage = 'Error: ' . $e->getMessage();
        }

        // Execute the next nodes
        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep, $input, $globalVariables);
        }
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

    // method to get ouput? output the input, filtered posts and the result?
}
