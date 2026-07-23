<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooCreateCoupon implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-coupon-create";
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
        return "wooCreateCoupon";
    }

    public function getLabel(): string
    {
        return __("Create a coupon", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step creates a new WooCommerce coupon.", "post-expirator");
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
                "label" => __("Coupon", "post-expirator"),
                "description" => __("The coupon to create.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "code",
                        "type" => "expression",
                        "label" => __("Coupon code", "post-expirator"),
                        "description" => __("The code customers will enter.", "post-expirator"),
                    ],
                    [
                        "name" => "discountType",
                        "type" => "select",
                        "label" => __("Discount type", "post-expirator"),
                        "settings" => [
                            "options" => [
                                ["value" => "percent", "label" => __("Percentage discount", "post-expirator")],
                                ["value" => "fixed_cart", "label" => __("Fixed cart discount", "post-expirator")],
                                ["value" => "fixed_product", "label" => __("Fixed product discount", "post-expirator")],
                            ],
                        ],
                        "default" => "percent",
                    ],
                    [
                        "name" => "amount",
                        "type" => "expression",
                        "label" => __("Amount", "post-expirator"),
                        "description" => __("The discount amount.", "post-expirator"),
                    ],
                    [
                        "name" => "expiryDate",
                        "type" => "expression",
                        "label" => __("Expiry date (optional)", "post-expirator"),
                        "description" => __("A date (YYYY-MM-DD) when the coupon expires.", "post-expirator"),
                    ],
                    [
                        "name" => "usageLimit",
                        "type" => "expression",
                        "label" => __("Usage limit (optional)", "post-expirator"),
                        "description" => __("How many times the coupon can be used.", "post-expirator"),
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
                    ["rule" => "required", "field" => "code"],
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
