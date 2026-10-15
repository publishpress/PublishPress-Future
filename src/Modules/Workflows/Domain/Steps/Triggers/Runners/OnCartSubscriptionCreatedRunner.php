<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnCartSubscriptionCreated;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowExecutionSafeguardInterface;

class OnCartSubscriptionCreatedRunner implements TriggerRunnerInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @var WorkflowExecutionSafeguardInterface
     */
    private $executionSafeguard;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    /**
     * @var array
     */
    private $step;

    /**
     * @var string
     */
    private $stepSlug;

    /**
     * @var int
     */
    private $workflowId;

    public function __construct(
        HookableInterface $hooks,
        StepProcessorInterface $stepProcessor,
        LoggerInterface $logger,
        \Closure $expirablePostModelFactory,
        WorkflowExecutionSafeguardInterface $executionSafeguard,
        ExecutionContextInterface $executionContext
    ) {
        $this->hooks = $hooks;
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->executionSafeguard = $executionSafeguard;
        $this->executionContext = $executionContext;
    }

    public static function getNodeTypeName(): string
    {
        return OnCartSubscriptionCreated::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->stepSlug = $this->stepProcessor->getSlugFromStep($this->step);
        $this->workflowId = $workflowId;

        $this->hooks->addAction(
            HooksAbstract::ACTION_PPCART_SUBSCRIPTION_CREATED,
            [$this, 'onSubscriptionCreatedCallback'],
            20,
            1
        );
    }

    /**
     * Fires on ppcart_subscription_created($sub), where $sub is a PPCart_Subscription
     * whose ->id is the subscription post ID.
     *
     * @param mixed $sub
     */
    public function onSubscriptionCreatedCallback($sub): void
    {
        $subscriptionId = (is_object($sub) && isset($sub->id)) ? (int) $sub->id : 0;
        if ($subscriptionId <= 0) {
            return;
        }

        $post = get_post($subscriptionId);
        if (! ($post instanceof \WP_Post)) {
            return;
        }

        $status = (is_object($sub) && isset($sub->status)) ? (string) $sub->status : '';

        $this->executionContext->setVariable($this->stepSlug, [
            'post' => new PostResolver($post, $this->hooks, '', $this->expirablePostModelFactory),
            'subscriptionId' => new IntegerResolver($subscriptionId),
            'status' => new StringResolver($status),
        ]);

        $this->executionContext->setVariable('global.trigger.postId', $subscriptionId);

        if ($this->shouldAbortExecution($subscriptionId)) {
            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'processTriggerExecution'],
            $subscriptionId
        );
    }

    private function shouldAbortExecution(int $subscriptionId): bool
    {
        $uniqueId = $this->executionSafeguard->generateUniqueExecutionIdentifier([
            $this->workflowId,
            $this->step['node']['id'],
            $subscriptionId,
        ]);

        if ($this->executionSafeguard->preventDuplicateExecution($uniqueId)) {
            $this->logger->debugWithArgs(
                'Duplicate execution detected for step "%s" and subscription #%d.',
                $this->stepSlug,
                $subscriptionId
            );

            return true;
        }

        return false;
    }

    public function processTriggerExecution($step, $subscriptionId)
    {
        $this->stepProcessor->triggerCallbackIsRunning();

        $this->logger->debugWithArgs(
            'Trigger executed: %s for Cart subscription #%d.',
            $this->stepSlug,
            $subscriptionId
        );

        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_TRIGGER_EXECUTED,
            $this->workflowId,
            $this->step
        );

        $this->stepProcessor->runNextSteps($this->step);
    }
}
