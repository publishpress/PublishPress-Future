<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooChangeSubscriptionStatus implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-subscription-change-status";
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
        return "wooChangeSubscriptionStatus";
    }

    public function getLabel(): string
    {
        return __("Change subscription status", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step changes the status of a WooCommerce subscription (for example, put it on hold or reactivate it).",
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
                "label" => __("Subscription", "post-expirator"),
                "description" => __("The subscription to update.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "subscriptionId",
                        "type" => "expression",
                        "label" => __("Subscription ID", "post-expirator"),
                        "description" => __("The ID of the subscription to update.", "post-expirator"),
                    ],
                    [
                        "name" => "newStatus",
                        "type" => "select",
                        "label" => __("New status", "post-expirator"),
                        "settings" => [
                            "options" => [
                                ["value" => "active", "label" => __("Active", "post-expirator")],
                                ["value" => "on-hold", "label" => __("On hold", "post-expirator")],
                                ["value" => "cancelled", "label" => __("Cancelled", "post-expirator")],
                                ["value" => "pending-cancel", "label" => __("Pending cancellation", "post-expirator")],
                                ["value" => "expired", "label" => __("Expired", "post-expirator")],
                            ],
                        ],
                        "default" => "on-hold",
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
                    ["rule" => "required", "field" => "subscriptionId"],
                    ["rule" => "required", "field" => "newStatus"],
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
        return true;
    }
}
