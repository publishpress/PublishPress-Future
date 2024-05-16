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

            if (empty($input)) {
                throw new Exception('Node has empty input');
            }

            if (! is_array($input)) {
                $input = [$input];
            }

            // TODO: Add a setting to allow the user to choose the key to get the posts, if more than one is available
            $inputKeys = array_keys($input);
            $posts = $input[$inputKeys[0]];

            foreach ($posts as $post) {
                if (is_array($post)) {
                    if (isset($post['post_id'])) {
                        $postId = $post['post_id'];
                    } elseif (isset($post['ID'])) {
                        $postId = $post['ID'];
                    }
                } elseif (is_object($post) && isset($post->ID)) {
                    $postId = $post->ID;
                } else {
                    $postId = intval($post);
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

    public function validatePost($post, $node)
    {
        if (! $this->hasValidPostType($post, $node)) {
            return false;
        }

        if (! $this->hasValidPostId($post, $node)) {
            return false;
        }

        if (! $this->hasValidPostStatus($post, $node)) {
            return false;
        }

        return true;
    }

    private function hasValidPostType($post, array $node)
    {
        $settingPostTypes = $node['data']['settings']['postQuery']['postType'] ?? [];

        if (!empty($settingPostTypes) && !in_array($post->post_type, $settingPostTypes)) {
            return false;
        }

        return true;
    }

    private function hasValidPostId($postId, array $node)
    {
        $settingPostIds = $node['data']['settings']['postQuery']['postIds'] ?? [];

        if (!empty($settingPostIds) && !in_array($postId, $settingPostIds)) {
            return false;
        }

        return true;
    }

    private function hasValidPostStatus($post, array $node)
    {
        $settingPostStatus = $node['data']['settings']['postQuery']['postStatus'] ?? [];

        if (!empty($settingPostStatus) && !in_array($post->post_status, $settingPostStatus)) {
            return false;
        }

        return true;
    }
}
