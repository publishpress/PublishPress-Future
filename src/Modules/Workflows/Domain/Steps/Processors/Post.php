<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Processors;

use Exception;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepPostRelatedProcessorInterface;

class Post implements StepProcessorInterface, StepPostRelatedProcessorInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var StepProcessorInterface
     */
    private $generalProcessor;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        HooksFacade $hooks,
        StepProcessorInterface $generalProcessor,
        LoggerInterface $logger,
        ExecutionContextInterface $executionContext
    ) {
        $this->hooks = $hooks;
        $this->generalProcessor = $generalProcessor;
        $this->executionContext = $executionContext;
        $this->logger = $logger;
    }

    public function setup(array $step, callable $setupCallback): void
    {
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
        $posts = $this->executionContext->getVariable($nodeSettings['post']['variable']);

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

            call_user_func($setupCallback, $postId, $nodeSettings, $step);
        }

        $this->runNextSteps($step);
    }

    public function runNextSteps(array $step, string $branch = 'output'): void
    {
        $this->generalProcessor->runNextSteps($step, $branch);
    }

    public function getNextSteps(array $step, string $branch = 'output'): array
    {
        return $this->generalProcessor->getNextSteps($step, $branch);
    }

    public function getNodeFromStep(array $step)
    {
        return $this->generalProcessor->getNodeFromStep($step);
    }

    public function getSlugFromStep(array $step)
    {
        return $this->generalProcessor->getSlugFromStep($step);
    }

    public function getNodeSettings(array $node)
    {
        return $this->generalProcessor->getNodeSettings($node);
    }

    public function logError(string $message, int $workflowId, array $step)
    {
        $this->addErrorLogMessage($message);
    }

    public function triggerCallbackIsRunning(): void
    {
        $this->generalProcessor->triggerCallbackIsRunning();
    }

    public function prepareLogMessage(string $message, ...$args): string
    {
        return $this->generalProcessor->prepareLogMessage($message, ...$args);
    }

    public function executeSafelyWithErrorHandling(array $step, callable $callback, ...$args): void
    {
        $this->generalProcessor->executeSafelyWithErrorHandling($step, $callback, ...$args);
    }

    private function addDebugLogMessage(string $message, ...$args): void
    {
        $this->logger->debug($this->prepareLogMessage($message, ...$args));
    }

    private function addErrorLogMessage(string $message, ...$args): void
    {
        $this->logger->error($this->prepareLogMessage($message, ...$args));
    }

    public function setPostIdOnTriggerGlobalVariable(int $postId): void
    {
        // Store the postID that triggered the workflow in the global variables so
        // we can trace it back to the post.
        $globalVariables = $this->executionContext->getVariable('global');
        $triggerVariable = $globalVariables['trigger'];
        $triggerVariable->postId = $postId;
    }
}
