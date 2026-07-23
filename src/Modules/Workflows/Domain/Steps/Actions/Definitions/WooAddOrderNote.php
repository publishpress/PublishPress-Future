<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooAddOrderNote implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-order-add-note";
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
        return "wooAddOrderNote";
    }

    public function getLabel(): string
    {
        return __("Add order note", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step adds a note to a WooCommerce order.", "post-expirator");
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
                "label" => __("Order", "post-expirator"),
                "description" => __("The order to add a note to.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "orderId",
                        "type" => "expression",
                        "label" => __("Order ID", "post-expirator"),
                        "description" => __("The ID of the order to add a note to.", "post-expirator"),
                    ],
                ],
            ],
            [
                "label" => __("Note", "post-expirator"),
                "description" => __("The note to add to the order.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "note",
                        "type" => "expression",
                        "label" => __("Note", "post-expirator"),
                        "description" => __("The note content.", "post-expirator"),
                    ],
                    [
                        "name" => "noteType",
                        "type" => "select",
                        "label" => __("Note type", "post-expirator"),
                        "description" => __(
                            "A private note is visible to admins only. A note to the customer is emailed to them.",
                            "post-expirator"
                        ),
                        "settings" => [
                            "options" => [
                                [
                                    "value" => "private",
                                    "label" => __("Private note", "post-expirator"),
                                ],
                                [
                                    "value" => "customer",
                                    "label" => __("Note to customer", "post-expirator"),
                                ],
                            ],
                        ],
                        "default" => "private",
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
                    [
                        "rule" => "hasIncomingConnection",
                    ],
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "orderId",
                    ],
                    [
                        "rule" => "required",
                        "field" => "note",
                    ],
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
            "target" => [
                [
                    "id" => "input",
                ]
            ],
            "source" => [
                [
                    "id" => "output",
                    "label" => __("Next", "post-expirator"),
                ]
            ]
        ];
    }

    public function isProFeature(): bool
    {
        return false;
    }
}
