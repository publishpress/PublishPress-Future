<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooCreateProduct implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-product-create";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_ACTION;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "wooCreateProduct";
    }

    public function getLabel(): string
    {
        return __("Create a product", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step creates a new simple WooCommerce product.", "post-expirator");
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
        return [
            [
                "label" => __("Product", "post-expirator"),
                "description" => __("The product to create.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "name",
                        "type" => "expression",
                        "label" => __("Product name", "post-expirator"),
                        "description" => __("The product title.", "post-expirator"),
                    ],
                    [
                        "name" => "regularPrice",
                        "type" => "expression",
                        "label" => __("Regular price", "post-expirator"),
                    ],
                    [
                        "name" => "salePrice",
                        "type" => "expression",
                        "label" => __("Sale price (optional)", "post-expirator"),
                    ],
                    [
                        "name" => "sku",
                        "type" => "expression",
                        "label" => __("SKU (optional)", "post-expirator"),
                    ],
                    [
                        "name" => "stockQuantity",
                        "type" => "expression",
                        "label" => __("Stock quantity (optional)", "post-expirator"),
                        "description" => __("Setting this enables stock management.", "post-expirator"),
                    ],
                    [
                        "name" => "description",
                        "type" => "expression",
                        "label" => __("Description (optional)", "post-expirator"),
                    ],
                    [
                        "name" => "status",
                        "type" => "select",
                        "label" => __("Status", "post-expirator"),
                        "settings" => [
                            "options" => [
                                ["value" => "publish", "label" => __("Published", "post-expirator")],
                                ["value" => "draft", "label" => __("Draft", "post-expirator")],
                                ["value" => "pending", "label" => __("Pending review", "post-expirator")],
                                ["value" => "private", "label" => __("Private", "post-expirator")],
                            ],
                        ],
                        "default" => "publish",
                    ],
                ],
            ],
        ];
    }

    public function getValidationSchema(): array
    {
        return [
            "connections" => [
                "rules" => [
                    ["rule" => "hasIncomingConnection"],
                ],
            ],
            "settings" => [
                "rules" => [
                    ["rule" => "required", "field" => "name"],
                ],
            ],
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return [];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "post-expirator"),
                "description" => __("The input data for this step.", "post-expirator"),
            ],
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAction";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [["id" => "input"]],
            "source" => [["id" => "output", "label" => __("Next", "post-expirator")]],
        ];
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
