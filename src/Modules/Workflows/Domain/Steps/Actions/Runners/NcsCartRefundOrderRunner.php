<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\NcsCartRefundOrder;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

class NcsCartRefundOrderRunner implements StepRunnerInterface
{
    use NcsCartResolverTrait;

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
        return NcsCartRefundOrder::getNodeTypeName();
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

                if (! function_exists('sc_order_refund')) {
                    $this->logger->debugWithArgs('PublishPress Cart not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $orderId = $this->resolveExpressionField($nodeSettings, 'orderId');
                if ($orderId === '' || ! ctype_digit($orderId)) {
                    $this->logger->debugWithArgs('No valid order ID, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }
                $orderId = (int) $orderId;

                if (get_post_type($orderId) !== 'sc_order') {
                    $this->logger->debugWithArgs(
                        'Post %1$s is not a Cart order, skipping | Slug: %2$s',
                        $orderId,
                        $nodeSlug
                    );
                    return;
                }

                $restock = $nodeSettings['restock'] ?? 'NO';
                if (is_array($restock)) {
                    $restock = $restock['value'] ?? 'NO';
                }

                // sc_order_refund() reads $data['restock'] without an isset guard, so it must always be set.
                $data = [
                    'id' => $orderId,
                    'restock' => ($restock === 'YES') ? 'YES' : 'NO',
                ];

                $refundAmount = $this->resolveExpressionField($nodeSettings, 'refundAmount');
                if ($refundAmount !== '' && is_numeric($refundAmount)) {
                    $data['refund_amount'] = (float) $refundAmount;
                }

                $result = sc_order_refund($data);

                if ($result === 'OK') {
                    $this->logger->debugWithArgs(
                        'Cart order %1$s refunded | Slug: %2$s',
                        $orderId,
                        $nodeSlug
                    );
                } else {
                    $this->logger->errorWithArgs(
                        'Cart order %1$s refund failed: %2$s | Slug: %3$s',
                        $orderId,
                        is_string($result) ? $result : 'unknown error',
                        $nodeSlug
                    );
                }
            }
        );
    }
}
