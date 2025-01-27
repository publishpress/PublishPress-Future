<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\LogAdd as NodeTypeLogAdd;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;

class AppendDebugLogRunner implements StepRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        NodeRunnerProcessorInterface $stepProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->variablesHandler = $variablesHandler;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return NodeTypeLogAdd::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->stepProcessor->setup($step, [$this, 'setupCallback']);
    }

    public function setupCallback(array $step)
    {
        $this->stepProcessor->executeSafelyWithErrorHandling(
            $step,
            function ($step) {
                $nodeSlug = $this->stepProcessor->getSlugFromStep($step);

                $node = $this->stepProcessor->getNodeFromStep($step);
                $nodeSettings = $this->stepProcessor->getNodeSettings($node);

                $message = $nodeSettings['message'] ?? '';

                if (is_array($message)) {
                    $message = $message['expression'] ?? '';
                }

                $message = $this->variablesHandler->replacePlaceholdersInText($message);
                $message = 'Slug: ' . $nodeSlug . ' | ' . $message;
                $message = $this->stepProcessor->prepareLogMessage($message, $nodeSlug);

                $availableLevels = [
                    'debug',
                    'info',
                    'notice',
                    'warning',
                    'error',
                    'critical',
                    'alert',
                ];
                $level = $nodeSettings['level'] ?? 'debug';

                if (! in_array($level, $availableLevels)) {
                    $level = 'debug';
                }

                $this->logger->{$level}($message);

                $this->logger->debug(
                    $this->stepProcessor->prepareLogMessage(
                        'Step completed | Slug: %s',
                        $nodeSlug
                    )
                );
            }
        );
    }
}
