<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\EmailFacade;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooGenerateCoupon;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use WC_Coupon;

class WooGenerateCouponRunner implements StepRunnerInterface
{
    use WooExpressionResolverTrait;

    /**
     * @var StepProcessorInterface
     */
    private $stepProcessor;

    /**
     * @var EmailFacade
     */
    private $emailFacade;

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
        EmailFacade $emailFacade,
        ExecutionContextInterface $executionContext,
        LoggerInterface $logger
    ) {
        $this->stepProcessor = $stepProcessor;
        $this->emailFacade = $emailFacade;
        $this->executionContext = $executionContext;
        $this->logger = $logger;
    }

    public static function getNodeTypeName(): string
    {
        return WooGenerateCoupon::getNodeTypeName();
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

                $prefix = $this->resolveExpressionField($nodeSettings, 'codePrefix');
                $code = $this->generateUniqueCode($prefix);

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

                $coupon->save();

                $this->logger->debugWithArgs(
                    'Coupon generated: %1$s | Coupon ID: %2$s | Slug: %3$s',
                    $code,
                    $coupon->get_id(),
                    $nodeSlug
                );

                $this->maybeEmailCode($nodeSettings, $code, $nodeSlug);
            }
        );
    }

    private function generateUniqueCode(string $prefix): string
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $code = $prefix . strtoupper(wp_generate_password(8, false, false));

            if (! function_exists('wc_get_coupon_id_by_code') || wc_get_coupon_id_by_code($code) === 0) {
                return $code;
            }
        }

        // Fall back to a code with a numeric suffix to reduce the collision chance.
        return $prefix . strtoupper(wp_generate_password(12, false, false));
    }

    private function maybeEmailCode(array $nodeSettings, string $code, string $nodeSlug): void
    {
        $emailTo = $this->resolveExpressionField($nodeSettings, 'emailTo');
        if ($emailTo === '') {
            return;
        }

        $emailTo = sanitize_email($emailTo);
        if ($emailTo === '' || ! is_email($emailTo)) {
            $this->logger->debugWithArgs('Invalid email, skipping send | Slug: %1$s', $nodeSlug);
            return;
        }

        // translators: %s: coupon code
        $subject = __('Your coupon code', 'post-expirator');
        // translators: %s: coupon code
        $message = sprintf(__('Here is your coupon code: %s', 'post-expirator'), $code);

        $this->emailFacade->send($emailTo, $subject, $message);

        $this->logger->debugWithArgs('Coupon code emailed to %1$s | Slug: %2$s', $emailTo, $nodeSlug);
    }
}
