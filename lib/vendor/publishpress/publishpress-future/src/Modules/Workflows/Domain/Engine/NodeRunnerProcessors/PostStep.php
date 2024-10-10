<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use Exception;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

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

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        HooksFacade $hooks,
        NodeRunnerProcessorInterface $generalNodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->hooks = $hooks;
        $this->generalNodeRunnerProcessor = $generalNodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
    }

    public function setup(array $step, callable $actionCallback): void
    {
        try {
            $node = $this->getNodeFromStep($step);
            $nodeSettings = $this->getNodeSettings($node);
            $workflowId = $this->variablesHandler->getVariable('global.workflow.id');

            if (! isset($nodeSettings['post'])) {
                throw new Exception('The "post" variable is not set in the node settings');
            }

            if (! isset($nodeSettings['post']['variable'])) {
                throw new Exception('The "post.variable" variable is not set in the node settings');
            }

            // We look for the "post" variable in the node settings
            $posts = $this->variablesHandler->getVariable($nodeSettings['post']['variable']);

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

                call_user_func($actionCallback, $postId, $nodeSettings, $step);
            }

            $this->runNextSteps($step);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $workflowId, $step);
        }
    }

    public function runNextSteps(array $step): void
    {
        $this->generalNodeRunnerProcessor->runNextSteps($step);
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

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->generalNodeRunnerProcessor->logError($message, $workflowId, $step);
    }

    public function triggerCallbackIsRunning(): void
    {
        $this->generalNodeRunnerProcessor->triggerCallbackIsRunning();
    }
}
