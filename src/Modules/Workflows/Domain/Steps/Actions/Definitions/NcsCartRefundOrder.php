<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class NcsCartRefundOrder implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.ncscart-order-refund";
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
        return "ncsCartRefundOrder";
    }

    public function getLabel(): string
    {
        return __("Refund Cart order", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step refunds a PublishPress Cart order, fully or partially.", "post-expirator");
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
        return [
            [
                "label" => __("Order", "post-expirator"),
                "description" => __("The order to refund.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "orderId",
                        "type" => "expression",
                        "label" => __("Order ID", "post-expirator"),
                        "description" => __("The ID of the Cart order to refund.", "post-expirator"),
                    ],
                    [
                        "name" => "refundAmount",
                        "type" => "expression",
                        "label" => __("Refund amount (optional)", "post-expirator"),
                        "description" => __(
                            "The amount to refund. Leave empty to refund the full order amount.",
                            "post-expirator"
                        ),
                    ],
                    [
                        "name" => "restock",
                        "type" => "select",
                        "label" => __("Restock", "post-expirator"),
                        "description" => __("Whether to restock the product on refund.", "post-expirator"),
                        "settings" => [
                            "options" => [
                                ["value" => "NO", "label" => __("Do not restock", "post-expirator")],
                                ["value" => "YES", "label" => __("Restock product", "post-expirator")],
                            ],
                        ],
                        "default" => "NO",
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
                    ["rule" => "required", "field" => "orderId"],
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
