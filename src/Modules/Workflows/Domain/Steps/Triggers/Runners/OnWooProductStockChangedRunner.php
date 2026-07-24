<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Runners;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\IntegerResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\PostResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\StringResolver;
use PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions\OnWooProductStockChanged;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\StepProcessorInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\TriggerRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowExecutionSafeguardInterface;

class OnWooProductStockChangedRunner implements TriggerRunnerInterface
{
    private const STOCK_PROPS = ['stock_quantity', 'stock_status', 'manage_stock'];

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
        return OnWooProductStockChanged::getNodeTypeName();
    }

    public function setup(int $workflowId, array $step): void
    {
        $this->step = $step;
        $this->stepSlug = $this->stepProcessor->getSlugFromStep($this->step);
        $this->workflowId = $workflowId;

        $this->hooks->addAction(
            HooksAbstract::ACTION_WC_PRODUCT_UPDATED_PROPS,
            [$this, 'onProductUpdatedPropsCallback'],
            20,
            2
        );
    }

    /**
     * Fires on woocommerce_product_object_updated_props($product, $updated_props).
     *
     * @param mixed $product
     * @param array $updatedProps
     */
    public function onProductUpdatedPropsCallback($product, $updatedProps = []): void
    {
        if (! is_object($product) || ! method_exists($product, 'get_id')) {
            return;
        }

        if (empty(array_intersect(self::STOCK_PROPS, (array) $updatedProps))) {
            return;
        }

        $productId = (int) $product->get_id();
        $post = get_post($productId);
        if (! ($post instanceof \WP_Post)) {
            return;
        }

        $stockQuantity = $product->get_stock_quantity();
        $stockStatus = (string) $product->get_stock_status();

        $this->executionContext->setVariable($this->stepSlug, [
            'post' => new PostResolver($post, $this->hooks, '', $this->expirablePostModelFactory),
            'productId' => new IntegerResolver($productId),
            'stockQuantity' => new StringResolver($stockQuantity === null ? '' : (string) $stockQuantity),
            'stockStatus' => new StringResolver($stockStatus),
        ]);

        $this->executionContext->setVariable('global.trigger.postId', $productId);

        if ($this->shouldAbortExecution($productId, (string) $stockQuantity . '|' . $stockStatus)) {
            return;
        }

        $this->stepProcessor->executeSafelyWithErrorHandling(
            $this->step,
            [$this, 'processTriggerExecution'],
            $productId
        );
    }

    private function shouldAbortExecution(int $productId, string $stockKey): bool
    {
        $uniqueId = $this->executionSafeguard->generateUniqueExecutionIdentifier([
            $this->workflowId,
            $this->step['node']['id'],
            $productId,
            $stockKey,
        ]);

        if ($this->executionSafeguard->preventDuplicateExecution($uniqueId)) {
            $this->logger->debugWithArgs(
                'Duplicate execution detected for step "%s" and product #%d.',
                $this->stepSlug,
                $productId
            );

            return true;
        }

        return false;
    }

    public function processTriggerExecution($step, $productId)
    {
        $this->stepProcessor->triggerCallbackIsRunning();

        $this->logger->debugWithArgs('Trigger executed: %s for product #%d.', $this->stepSlug, $productId);

        $this->hooks->doAction(
            HooksAbstract::ACTION_WORKFLOW_TRIGGER_EXECUTED,
            $this->workflowId,
            $this->step
        );

        $this->stepProcessor->runNextSteps($this->step);
    }
}
