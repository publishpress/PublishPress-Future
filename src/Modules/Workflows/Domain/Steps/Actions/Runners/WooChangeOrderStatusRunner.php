<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooChangeOrderStatus;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

class WooChangeOrderStatusRunner implements StepRunnerInterface
{
    use WooExpressionResolverTrait;

    /**
     * Filterable ceiling on how many orders a single filter-based run will touch.
     */
    public const DEFAULT_MAX_ORDERS = 1000;

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
        return WooChangeOrderStatus::getNodeTypeName();
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

                if (! function_exists('wc_get_order')) {
                    $this->logger->debugWithArgs('WooCommerce not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $newStatus = $nodeSettings['newStatus'] ?? '';
                if (is_array($newStatus)) {
                    $newStatus = $newStatus['value'] ?? '';
                }
                $newStatus = is_string($newStatus) ? trim($newStatus) : '';

                if ($newStatus === '') {
                    $this->logger->debugWithArgs('No new status selected, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $orderIds = $this->resolveOrderIds($nodeSettings, $nodeSlug);
                if (empty($orderIds)) {
                    $this->logger->debugWithArgs('No matching orders, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                foreach ($orderIds as $orderId) {
                    $order = wc_get_order($orderId);
                    if (! $order) {
                        continue;
                    }

                    if ($order->get_status() === $newStatus) {
                        continue;
                    }

                    $order->update_status($newStatus, '', true);

                    $this->logger->debugWithArgs(
                        'Order %1$s moved to status %2$s | Slug: %3$s',
                        $orderId,
                        $newStatus,
                        $nodeSlug
                    );
                }
            }
        );
    }

    /**
     * @return int[]
     */
    private function resolveOrderIds(array $nodeSettings, string $nodeSlug): array
    {
        $orderId = $this->resolveExpressionField($nodeSettings, 'orderId');
        if ($orderId !== '' && ctype_digit($orderId)) {
            return [(int) $orderId];
        }

        if (! function_exists('wc_get_orders')) {
            return [];
        }

        $matchStatus = $nodeSettings['matchStatus'] ?? 'any';
        if (is_array($matchStatus)) {
            $matchStatus = $matchStatus['value'] ?? 'any';
        }

        $maxOrders = (int) apply_filters('publishpressfuture_bulk_order_limit', self::DEFAULT_MAX_ORDERS);

        $args = [
            'return' => 'ids',
            'limit' => $maxOrders > 0 ? $maxOrders : -1,
        ];

        if (is_string($matchStatus) && $matchStatus !== '' && $matchStatus !== 'any') {
            $args['status'] = $matchStatus;
        }

        $olderThanDays = $this->resolveExpressionField($nodeSettings, 'olderThanDays');
        if ($olderThanDays !== '' && is_numeric($olderThanDays) && (int) $olderThanDays > 0) {
            $args['date_created'] = '<' . (time() - ((int) $olderThanDays * DAY_IN_SECONDS));
        }

        $ids = wc_get_orders($args);

        return array_map('intval', is_array($ids) ? $ids : []);
    }
}
