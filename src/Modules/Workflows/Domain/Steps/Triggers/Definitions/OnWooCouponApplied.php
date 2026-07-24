<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnWooCouponApplied implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.woo-coupon-applied";
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
        return "onWooCouponApplied";
    }

    public function getLabel(): string
    {
        return __("Coupon is applied", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a customer applies a WooCommerce coupon to their cart.",
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
                "name" => "couponCode",
                "type" => "string",
                "label" => __("Coupon code", "post-expirator"),
                "description" => __("The code of the applied coupon.", "post-expirator"),
            ],
            [
                "name" => "couponId",
                "type" => "integer",
                "label" => __("Coupon ID", "post-expirator"),
                "description" => __("The ID of the applied coupon.", "post-expirator"),
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
