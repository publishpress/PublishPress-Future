<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooRemoveMembership implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-membership-remove";
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
        return "wooRemoveMembership";
    }

    public function getLabel(): string
    {
        return __("Remove user from a membership", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step removes a user from a WooCommerce membership plan.", "post-expirator");
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
                "label" => __("Membership", "post-expirator"),
                "description" => __("The user and membership plan.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "userId",
                        "type" => "expression",
                        "label" => __("User ID", "post-expirator"),
                        "description" => __("The user to remove from the plan.", "post-expirator"),
                    ],
                    [
                        "name" => "planId",
                        "type" => "expression",
                        "label" => __("Membership plan ID", "post-expirator"),
                        "description" => __("The membership plan to remove the user from.", "post-expirator"),
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
                    ["rule" => "required", "field" => "userId"],
                    ["rule" => "required", "field" => "planId"],
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
