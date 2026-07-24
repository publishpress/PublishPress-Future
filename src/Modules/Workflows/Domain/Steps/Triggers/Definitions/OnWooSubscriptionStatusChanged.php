<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnWooSubscriptionStatusChanged implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.woo-subscription-status-changed";
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
        return "onWooSubscriptionStatusChanged";
    }

    public function getLabel(): string
    {
        return __("Subscription status is changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a WooCommerce Subscriptions subscription changes status "
            . "(for example active, on-hold, cancelled, expired).",
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
                "name" => "subscriptionId",
                "type" => "integer",
                "label" => __("Subscription ID", "post-expirator"),
                "description" => __("The ID of the subscription.", "post-expirator"),
            ],
            [
                "name" => "oldStatus",
                "type" => "string",
                "label" => __("Previous status", "post-expirator"),
                "description" => __("The subscription's previous status.", "post-expirator"),
            ],
            [
                "name" => "newStatus",
                "type" => "string",
                "label" => __("New status", "post-expirator"),
                "description" => __("The subscription's new status.", "post-expirator"),
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
        return true;
    }
}
