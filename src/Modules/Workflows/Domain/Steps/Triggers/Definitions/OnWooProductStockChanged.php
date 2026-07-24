<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnWooProductStockChanged implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.woo-product-stock-changed";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onWooProductStockChanged";
    }

    public function getLabel(): string
    {
        return __("Product stock is changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a WooCommerce product's stock quantity or stock status changes.",
            "post-expirator"
        );
    }

    public function getIcon(): string
    {
        return "cart";
    }

    public function getFrecency(): int
    {
        return 1;
    }

    public function getVersion(): int
    {
        return 1;
    }

    public function getCategory(): string
    {
        return "woocommerce";
    }

    public function getSettingsSchema(): array
    {
        return [];
    }

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    ["rule" => "hasOutgoingConnection"],
                ],
            ],
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return [
            [
                "name" => "post",
                "type" => "post",
                "label" => __("Product post", "post-expirator"),
                "description" => __("The product whose stock changed.", "post-expirator"),
            ],
            [
                "name" => "productId",
                "type" => "integer",
                "label" => __("Product ID", "post-expirator"),
                "description" => __("The ID of the product.", "post-expirator"),
            ],
            [
                "name" => "stockQuantity",
                "type" => "string",
                "label" => __("Stock quantity", "post-expirator"),
                "description" => __("The product's current stock quantity.", "post-expirator"),
            ],
            [
                "name" => "stockStatus",
                "type" => "string",
                "label" => __("Stock status", "post-expirator"),
                "description" => __("The product's current stock status.", "post-expirator"),
            ],
        ];
    }

    public function getOutputSchema(): array
    {
        return $this->getStepScopedVariablesSchema();
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                ["id" => "output", "label" => __("Next", "post-expirator")],
            ],
        ];
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
