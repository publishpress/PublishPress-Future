<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnWooOrderStatusChanged implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.woo-order-status-changed";
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
        return "onWooOrderStatusChanged";
    }

    public function getLabel(): string
    {
        return __("Order status is changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates when a WooCommerce order's status changes.", "post-expirator");
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
                "name" => "orderId",
                "type" => "integer",
                "label" => __("Order ID", "post-expirator"),
                "description" => __("The ID of the order.", "post-expirator"),
            ],
            [
                "name" => "oldStatus",
                "type" => "string",
                "label" => __("Previous status", "post-expirator"),
                "description" => __("The order's previous status.", "post-expirator"),
            ],
            [
                "name" => "newStatus",
                "type" => "string",
                "label" => __("New status", "post-expirator"),
                "description" => __("The order's new status.", "post-expirator"),
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
