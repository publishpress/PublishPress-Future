<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooGenerateCoupon implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-coupon-generate";
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
        return "wooGenerateCoupon";
    }

    public function getLabel(): string
    {
        return __("Generate a coupon code", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step generates a random coupon code, creates the coupon, and can email it to a recipient.",
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
        return [
            [
                "label" => __("Coupon settings", "post-expirator"),
                "description" => __("The generated coupon's settings.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "codePrefix",
                        "type" => "expression",
                        "label" => __("Code prefix (optional)", "post-expirator"),
                        "description" => __("Prepended to the randomly generated code.", "post-expirator"),
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
            [
                "label" => __("Email (optional)", "post-expirator"),
                "description" => __("Optionally email the generated code to a recipient.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "emailTo",
                        "type" => "expression",
                        "label" => __("Send code to", "post-expirator"),
                        "description" => __(
                            "An email address to send the generated coupon code to. Leave empty to skip.",
                            "post-expirator"
                        ),
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
