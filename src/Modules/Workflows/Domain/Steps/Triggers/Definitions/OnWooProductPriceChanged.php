<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnWooProductPriceChanged implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.woo-product-price-changed";
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
        return "onWooProductPriceChanged";
    }

    public function getLabel(): string
    {
        return __("Product price is changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a WooCommerce product's regular or sale price changes.",
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
                "description" => __("The product whose price changed.", "post-expirator"),
            ],
            [
                "name" => "productId",
                "type" => "integer",
                "label" => __("Product ID", "post-expirator"),
                "description" => __("The ID of the product.", "post-expirator"),
            ],
            [
                "name" => "price",
                "type" => "string",
                "label" => __("Current price", "post-expirator"),
                "description" => __("The product's current active price.", "post-expirator"),
            ],
            [
                "name" => "regularPrice",
                "type" => "string",
                "label" => __("Regular price", "post-expirator"),
                "description" => __("The product's regular price.", "post-expirator"),
            ],
            [
                "name" => "salePrice",
                "type" => "string",
                "label" => __("Sale price", "post-expirator"),
                "description" => __("The product's sale price.", "post-expirator"),
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
