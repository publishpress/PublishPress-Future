<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions\WooCreateProduct;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepRunnerInterface;
use WC_Product_Simple;

class WooCreateProductRunner implements StepRunnerInterface
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
        return WooCreateProduct::getNodeTypeName();
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

                if (! class_exists('WC_Product_Simple')) {
                    $this->logger->debugWithArgs('WooCommerce not active, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $nodeSettings = $this->stepProcessor->getNodeSettings(
                    $this->stepProcessor->getNodeFromStep($step)
                );

                $name = $this->resolveExpressionField($nodeSettings, 'name');
                if ($name === '') {
                    $this->logger->debugWithArgs('No product name, skipping | Slug: %1$s', $nodeSlug);
                    return;
                }

                $product = new WC_Product_Simple();
                $product->set_name($name);
                $product->set_status($this->resolveSelectField($nodeSettings, 'status', 'publish'));

                $regularPrice = $this->resolveExpressionField($nodeSettings, 'regularPrice');
                if ($regularPrice !== '') {
                    $product->set_regular_price($regularPrice);
                }

                $salePrice = $this->resolveExpressionField($nodeSettings, 'salePrice');
                if ($salePrice !== '') {
                    $product->set_sale_price($salePrice);
                }

                $sku = $this->resolveExpressionField($nodeSettings, 'sku');
                if ($sku !== '') {
                    $product->set_sku($sku);
                }

                $description = $this->resolveExpressionField($nodeSettings, 'description');
                if ($description !== '') {
                    $product->set_description($description);
                }

                $stockQuantity = $this->resolveExpressionField($nodeSettings, 'stockQuantity');
                if ($stockQuantity !== '' && is_numeric($stockQuantity)) {
                    $product->set_manage_stock(true);
                    $product->set_stock_quantity((int) $stockQuantity);
                }

                $productId = $product->save();

                $this->logger->debugWithArgs(
                    'Product created: %1$s | Product ID: %2$s | Slug: %3$s',
                    $name,
                    $productId,
                    $nodeSlug
                );
            }
        );
    }
}
