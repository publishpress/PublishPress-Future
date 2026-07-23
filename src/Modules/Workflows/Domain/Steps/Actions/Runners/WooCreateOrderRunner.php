<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooCreateOrder;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

class WooCreateOrderRunner implements StepRunnerInterface
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
        return WooCreateOrder::getNodeTypeName();
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

                if (! function_exists('wc_create_order') || ! function_exists('wc_get_product')) {
                    $this->logger->debugWithArgs('WooCommerce not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $productRef = $this->resolveExpressionField($nodeSettings, 'productId');
                $productId = $this->resolveProductId($productRef);
                $product = $productId > 0 ? wc_get_product($productId) : false;
                if (! $product) {
                    $this->logger->debugWithArgs(
                        'Product %1$s not found, skipping | Slug: %2$s',
                        $productRef,
                        $nodeSlug
                    );
                    return;
                }

                $quantity = $this->resolveExpressionField($nodeSettings, 'quantity');
                $quantity = ($quantity !== '' && (int) $quantity > 0) ? (int) $quantity : 1;

                $order = wc_create_order();
                if (is_wp_error($order)) {
                    $this->logger->errorWithArgs(
                        'Failed to create order: %1$s | Slug: %2$s',
                        $order->get_error_message(),
                        $nodeSlug
                    );
                    return;
                }

                $customerId = $this->resolveExpressionField($nodeSettings, 'customerId');
                if ($customerId !== '' && ctype_digit($customerId)) {
                    $order->set_customer_id((int) $customerId);
                }

                $order->add_product($product, $quantity);
                $order->set_status($this->resolveSelectField($nodeSettings, 'status', 'pending'));
                $order->calculate_totals();
                $order->save();

                $this->logger->debugWithArgs(
                    'Order created | Order ID: %1$s | Slug: %2$s',
                    $order->get_id(),
                    $nodeSlug
                );
            }
        );
    }
}
