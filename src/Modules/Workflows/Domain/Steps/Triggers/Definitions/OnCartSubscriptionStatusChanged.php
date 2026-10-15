<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnCartSubscriptionStatusChanged implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.ncscart-subscription-status-changed";
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
        return "onCartSubscriptionStatusChanged";
    }

    public function getLabel(): string
    {
        return __("Cart subscription status changes", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when a PublishPress Cart subscription is created or its status changes "
            . "(for example active, paused, canceled, past due).",
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
                "label" => __("Subscription post", "post-expirator"),
                "description" => __("The subscription post.", "post-expirator"),
            ],
            [
                "name" => "subscriptionId",
                "type" => "integer",
                "label" => __("Subscription ID", "post-expirator"),
                "description" => __("The ID of the subscription.", "post-expirator"),
            ],
            [
                "name" => "status",
                "type" => "string",
                "label" => __("Subscription status", "post-expirator"),
                "description" => __("The current status of the subscription.", "post-expirator"),
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
