<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use Exception;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;

class PostStep implements NodeRunnerProcessorInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var NodeRunnerProcessorInterface
     */
    private $generalNodeRunnerProcessor;

    public function __construct(HooksFacade $hooks, NodeRunnerProcessorInterface $generalNodeRunnerProcessor)
    {
        $this->hooks = $hooks;
        $this->generalNodeRunnerProcessor = $generalNodeRunnerProcessor;
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

                call_user_func($actionCallback, $postId, $nodeSettings, $step, $contextVariables);
            }

            $this->runNextSteps($step, $contextVariables);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function runNextSteps(array $step, array $contextVariables): void
    {
        $this->generalNodeRunnerProcessor->runNextSteps($step, $contextVariables);
    }

    public function getNextSteps(array $step)
    {
        return $this->generalNodeRunnerProcessor->getNextSteps($step);
    }

    public function getNodeFromStep(array $step)
    {
        return $this->generalNodeRunnerProcessor->getNodeFromStep($step);
    }

    public function getSlugFromStep(array $step)
    {
        return $this->generalNodeRunnerProcessor->getSlugFromStep($step);
    }

    public function getNodeSettings(array $node)
    {
        return $this->generalNodeRunnerProcessor->getNodeSettings($node);
    }

    public function getWorkflowIdFromContextVariables(array $contextVariables)
    {
        return $this->generalNodeRunnerProcessor->getWorkflowIdFromContextVariables($contextVariables);
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->generalNodeRunnerProcessor->logError($message, $workflowId, $step);
    }

    public function getVariableValueFromContextVariables(string $variableName, array $contextVariables)
    {
        return $this->generalNodeRunnerProcessor->getVariableValueFromContextVariables(
            $variableName,
            $contextVariables
        );
    }

    public function triggerCallbackIsRunning(array $contextVariables): void
    {
        $this->generalNodeRunnerProcessor->triggerCallbackIsRunning($contextVariables);
    }
}
