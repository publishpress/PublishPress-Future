<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnWooOrderStatusChanged;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowExecutionSafeguardInterface;

class OnWooOrderStatusChangedRunner implements TriggerRunnerInterface
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
        WorkflowExecutionSafeguardInterface $executionSafeguard,
        ExecutionContextInterface $executionContext
    ) {
        $this->hooks = $hooks;
        $this->stepProcessor = $stepProcessor;
        $this->logger = $logger;
        $this->executionSafeguard = $executionSafeguard;
        $this->executionContext = $executionContext;
    }

    public static function getNodeTypeName(): string
    {
        return OnWooOrderStatusChanged::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->stepSlug = $this->stepProcessor->getSlugFromStep($this->step);
        $this->workflowId = $workflowId;

        $this->hooks->addAction(
            HooksAbstract::ACTION_WC_ORDER_STATUS_CHANGED,
            [$this, 'onOrderStatusChangedCallback'],
            20,
            4
        );
    }

    /**
     * Fires on woocommerce_order_status_changed($order_id, $old_status, $new_status, $order).
     *
     * @param int $orderId
     * @param string $oldStatus
     * @param string $newStatus
     * @param mixed $order
     */
    public function onOrderStatusChangedCallback($orderId, $oldStatus = '', $newStatus = '', $order = null): void
    {
        $orderId = (int) $orderId;
        if ($orderId <= 0) {
            return;
        }

        $this->executionContext->setVariable($this->stepSlug, [
            'orderId' => new IntegerResolver($orderId),
            'oldStatus' => new StringResolver((string) $oldStatus),
            'newStatus' => new StringResolver((string) $newStatus),
        ]);

        $this->executionContext->setVariable('global.trigger.postId', $orderId);

        if ($this->shouldAbortExecution($orderId, (string) $oldStatus . '>' . (string) $newStatus)) {
            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'processTriggerExecution'],
            $orderId
        );
    }

    private function shouldAbortExecution(int $orderId, string $transition): bool
    {
        $uniqueId = $this->executionSafeguard->generateUniqueExecutionIdentifier([
            $this->workflowId,
            $this->step['node']['id'],
            $orderId,
            $transition,
        ]);

        if ($this->executionSafeguard->preventDuplicateExecution($uniqueId)) {
            $this->logger->debugWithArgs(
                'Duplicate execution detected for step "%s" and order #%d.',
                $this->stepSlug,
                $orderId
            );

            return true;
        }

        return false;
    }

    public function processTriggerExecution($step, $orderId)
    {
        $this->stepProcessor->triggerCallbackIsRunning();

        $this->logger->debugWithArgs('Trigger executed: %s for order #%d.', $this->stepSlug, $orderId);

        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_TRIGGER_EXECUTED,
            $this->workflowId,
            $this->step
        );

        $this->stepProcessor->runNextSteps($this->step);
    }
}
