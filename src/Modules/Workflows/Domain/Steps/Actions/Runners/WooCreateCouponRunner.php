<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooCreateCoupon;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use WC_Coupon;

class WooCreateCouponRunner implements StepRunnerInterface
{
    use WooExpressionResolverTrait;

    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var ExecutionContextInterface
     */
    private $executionContext;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(
        StepProcessorInterface $stepProcessor,
        ExecutionContextInterface $executionContext,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->executionContext = $executionContext;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return WooCreateCoupon::getNodeTypeName();
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

                if (! class_exists('WC_Coupon')) {
                    $this->logger->debugWithArgs('WooCommerce not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $code = $this->resolveExpressionField($nodeSettings, 'code');
                if ($code === '') {
                    $this->logger->debugWithArgs('No coupon code, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $coupon = $this->buildCoupon($nodeSettings, $code);
                $coupon->save();

                $this->logger->debugWithArgs(
                    'Coupon created: %1$s | Coupon ID: %2$s | Slug: %3$s',
                    $code,
                    $coupon->get_id(),
                    $nodeSlug
                );
            }
        );
    }

    /**
     * Build a coupon from the shared coupon settings. Reused by the generate-code runner.
     */
    private function buildCoupon(array $nodeSettings, string $code): WC_Coupon
    {
        $coupon = new WC_Coupon();
        $coupon->set_code($code);
        $coupon->set_discount_type($this->resolveSelectField($nodeSettings, 'discountType', 'percent'));

        $amount = $this->resolveExpressionField($nodeSettings, 'amount');
        if ($amount !== '') {
            $coupon->set_amount($amount);
        }

        $expiryDate = $this->resolveExpressionField($nodeSettings, 'expiryDate');
        if ($expiryDate !== '') {
            $timestamp = strtotime($expiryDate);
            if ($timestamp !== false) {
                $coupon->set_date_expires($timestamp);
            }
        }

        $usageLimit = $this->resolveExpressionField($nodeSettings, 'usageLimit');
        if ($usageLimit !== '' && is_numeric($usageLimit) && (int) $usageLimit > 0) {
            $coupon->set_usage_limit((int) $usageLimit);
        }

        return $coupon;
    }
}
