<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooAddOrderNote;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;

class WooAddOrderNoteRunner implements StepRunnerInterface
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
        return WooAddOrderNote::getNodeTypeName();
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

                $orderRef = $this->resolveExpressionField($nodeSettings, 'orderId');
                if ($orderRef === '' || ! ctype_digit($orderRef)) {
                    $this->logger->debugWithArgs('No valid order ID, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $order = wc_get_order((int) $orderRef);
                if (! $order) {
                    $this->logger->debugWithArgs('Order %1$s not found | Slug: %2$s', $orderRef, $nodeSlug);
                    return;
                }

                $note = $this->resolveExpressionField($nodeSettings, 'note');
                if ($note === '') {
                    $this->logger->debugWithArgs('Note is empty, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $noteType = $nodeSettings['noteType'] ?? 'private';
                if (is_array($noteType)) {
                    $noteType = $noteType['value'] ?? 'private';
                }
                $isCustomerNote = ($noteType === 'customer') ? 1 : 0;

                $order->add_order_note($note, $isCustomerNote, false);

                $this->logger->debugWithArgs(
                    'Note added to order %1$s | Slug: %2$s',
                    $orderRef,
                    $nodeSlug
                );
            }
        );
    }
}
