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

    public function setup(array $step, callable $actionCallback, array $contextVariables = []): void
    {
        try {
            $node = $this->getNodeFromStep($step);
            $nodeSettings = $this->getNodeSettings($node);
            $workflowId = $this->getWorkflowIdFromContextVariables($contextVariables);

            if (! isset($nodeSettings['post'])) {
                throw new Exception('The "post" variable is not set in the node settings');
            }

            if (! isset($nodeSettings['post']['variable'])) {
                throw new Exception('The "post.variable" variable is not set in the node settings');
            }

            // We look for the "post" variable in the node settings
            $posts = $this->getVariableValueFromContextVariables($nodeSettings['post']['variable'], $contextVariables);

            if (empty($posts)) {
                // TODO: Log this
                return;
            }

            if (! is_array($posts)) {
                $posts = [$posts];
            }

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

            $this->runNextSteps($step, $contextVariables);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function runNextSteps(array $step, array $contextVariables): void
    {
        $this->generalNodeRunnerPreparer->runNextSteps($step, $contextVariables);
    }

    public function getNextSteps(array $step)
    {
        return $this->generalNodeRunnerPreparer->getNextSteps($step);
    }

    public function getNodeFromStep(array $step)
    {
        return $this->generalNodeRunnerPreparer->getNodeFromStep($step);
    }

    public function getSlugFromStep(array $step)
    {
        return $this->generalNodeRunnerPreparer->getSlugFromStep($step);
    }

    public function getNodeSettings(array $node)
    {
        return $this->generalNodeRunnerPreparer->getNodeSettings($node);
    }

    public function getWorkflowIdFromContextVariables(array $contextVariables)
    {
        return $this->generalNodeRunnerPreparer->getWorkflowIdFromContextVariables($contextVariables);
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->generalNodeRunnerPreparer->logError($message, $workflowId, $step);
    }

    public function getVariableValueFromContextVariables(string $variableName, array $contextVariables)
    {
        return $this->generalNodeRunnerPreparer->getVariableValueFromContextVariables($variableName, $contextVariables);
    }
}
