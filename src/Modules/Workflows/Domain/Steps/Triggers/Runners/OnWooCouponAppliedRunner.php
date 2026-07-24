<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnWooCouponApplied;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowExecutionSafeguardInterface;

class OnWooCouponAppliedRunner implements TriggerRunnerInterface
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
        return OnWooCouponApplied::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->stepSlug = $this->stepProcessor->getSlugFromStep($this->step);
        $this->workflowId = $workflowId;

        $this->hooks->addAction(
            HooksAbstract::ACTION_WC_APPLIED_COUPON,
            [$this, 'onCouponAppliedCallback'],
            20,
            1
        );
    }

    /**
     * Fires on woocommerce_applied_coupon($coupon_code).
     *
     * @param string $couponCode
     */
    public function onCouponAppliedCallback($couponCode): void
    {
        $couponCode = (string) $couponCode;
        if ($couponCode === '') {
            return;
        }

        $couponId = function_exists('wc_get_coupon_id_by_code')
            ? (int) wc_get_coupon_id_by_code($couponCode)
            : 0;

        $this->executionContext->setVariable($this->stepSlug, [
            'couponCode' => new StringResolver($couponCode),
            'couponId' => new IntegerResolver($couponId),
        ]);

        if ($this->shouldAbortExecution($couponCode)) {
            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'processTriggerExecution'],
            $couponCode
        );
    }

    private function shouldAbortExecution(string $couponCode): bool
    {
        $uniqueId = $this->executionSafeguard->generateUniqueExecutionIdentifier([
            $this->workflowId,
            $this->step['node']['id'],
            $couponCode,
        ]);

        if ($this->executionSafeguard->preventDuplicateExecution($uniqueId)) {
            $this->logger->debugWithArgs(
                'Duplicate execution detected for step "%s" and coupon %s.',
                $this->stepSlug,
                $couponCode
            );

            return true;
        }

        return false;
    }

    public function processTriggerExecution($step, $couponCode)
    {
        $this->stepProcessor->triggerCallbackIsRunning();

        $this->logger->debugWithArgs('Trigger executed: %s for coupon %s.', $this->stepSlug, $couponCode);

        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_TRIGGER_EXECUTED,
            $this->workflowId,
            $this->step
        );

        $this->stepProcessor->runNextSteps($this->step);
    }
}
