<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnCartOrderRefunded implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.ncscart-order-refunded";
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
        return "onCartOrderRefunded";
    }

    public function getLabel(): string
    {
        return __("Cart order is refunded", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates when a PublishPress Cart order is refunded.", "post-expirator");
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
        return "publishpress-cart";
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
                "label" => __("Order post", "post-expirator"),
                "description" => __("The order post that was refunded.", "post-expirator"),
            ],
            [
                "name" => "orderId",
                "type" => "integer",
                "label" => __("Order ID", "post-expirator"),
                "description" => __("The ID of the refunded order.", "post-expirator"),
            ],
            [
                "name" => "refundAmount",
                "type" => "string",
                "label" => __("Refund amount", "post-expirator"),
                "description" => __("The amount that was refunded.", "post-expirator"),
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
