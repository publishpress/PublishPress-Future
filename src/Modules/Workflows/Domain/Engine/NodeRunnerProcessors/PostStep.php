<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine\NodeRunnerProcessors;

use Exception;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

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

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        HooksFacade $hooks,
        NodeRunnerProcessorInterface $generalNodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->hooks = $hooks;
        $this->generalNodeRunnerProcessor = $generalNodeRunnerProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
    }

    public function setup(array $step, callable $actionCallback): void
    {
        try {
            $this->addDebugLogMessage(
                'Setting up step %s',
                $step['node']['data']['slug']
            );

            $node = $this->getNodeFromStep($step);
            $nodeSettings = $this->getNodeSettings($node);

            if (! isset($nodeSettings['post'])) {
                $this->addErrorLogMessage(
                    'The "post" variable is not set in the node settings for step %s',
                    $step['node']['data']['slug']
                );

                throw new Exception('The "post" variable is not set in the node settings');
            }

            if (! isset($nodeSettings['post']['variable'])) {
                $this->addErrorLogMessage(
                    'The post.variable variable is not set in the node settings for step %s',
                    $step['node']['data']['slug']
                );

                throw new Exception('The "post.variable" variable is not set in the node settings');
            }

            // We look for the "post" variable in the node settings
            $posts = $this->variablesHandler->getVariable($nodeSettings['post']['variable']);

            if (empty($posts)) {
                $this->addDebugLogMessage(
                    'Step %s didn\'t find any posts, skipping',
                    $step['node']['data']['slug']
                );

                return;
            }

            if (! is_array($posts)) {
                $posts = [$posts];
            }

            foreach ($posts as $post) {
                $this->addDebugLogMessage(
                    'Processing post %s on step %s',
                    $post,
                    $step['node']['data']['slug']
                );

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
            $this->addErrorLogMessage($e->getMessage());
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
        $this->addErrorLogMessage($message);
    }

    public function triggerCallbackIsRunning(): void
    {
        $this->generalNodeRunnerProcessor->triggerCallbackIsRunning();
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        return $this->generalNodeRunnerProcessor->prepareLogMessage($message, ...$args);
    }

    private function addDebugLogMessage(string $message, ...$args): void
    {
        $this->logger->debug($this->prepareLogMessage($message, ...$args));
    }

    private function addErrorLogMessage(string $message, ...$args): void
    {
        $this->logger->error($this->prepareLogMessage($message, ...$args));
    }
}
