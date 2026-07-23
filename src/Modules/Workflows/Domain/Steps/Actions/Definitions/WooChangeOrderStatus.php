<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooChangeOrderStatus implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-order-change-status";
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
        return "wooChangeOrderStatus";
    }

    public function getLabel(): string
    {
        return __("Change order status", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step changes the status of a specific order, or of every order matching a filter "
            . "(for example, cancel unpaid orders older than N days).",
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

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function getOrderStatusOptions(bool $withAny = false): array
    {
        $options = [];

        if ($withAny) {
            $options[] = ["value" => "any", "label" => __("Any status", "post-expirator")];
        }

        if (function_exists('wc_get_order_statuses')) {
            foreach (wc_get_order_statuses() as $key => $label) {
                // wc_get_order_statuses() keys are prefixed with "wc-"; the CRUD/update
                // API expects the unprefixed slug.
                $options[] = [
                    "value" => (strpos($key, 'wc-') === 0) ? substr($key, 3) : $key,
                    "label" => $label,
                ];
            }
        }

        return $options;
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Order selection", "post-expirator"),
                "description" => __(
                    "Target a specific order by ID, or leave the ID empty and use the filter to target "
                    . "every matching order.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "orderId",
                        "type" => "expression",
                        "label" => __("Order ID (optional)", "post-expirator"),
                        "description" => __(
                            "A specific order ID. Leave empty to use the filter below.",
                            "post-expirator"
                        ),
                    ],
                    [
                        "name" => "matchStatus",
                        "type" => "select",
                        "label" => __("Only orders currently in status", "post-expirator"),
                        "description" => __("Restrict the filter to orders in this status.", "post-expirator"),
                        "settings" => [
                            "options" => $this->getOrderStatusOptions(true),
                        ],
                        "default" => "any",
                    ],
                    [
                        "name" => "olderThanDays",
                        "type" => "expression",
                        "label" => __("Only orders older than (days)", "post-expirator"),
                        "description" => __(
                            "Restrict the filter to orders created more than this many days ago. "
                            . "Leave empty for no age restriction.",
                            "post-expirator"
                        ),
                    ],
                ],
            ],
            [
                "label" => __("New status", "post-expirator"),
                "description" => __("The status the matching orders will be moved to.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "newStatus",
                        "type" => "select",
                        "label" => __("New status", "post-expirator"),
                        "description" => __("The new order status.", "post-expirator"),
                        "settings" => [
                            "options" => $this->getOrderStatusOptions(false),
                        ],
                        "default" => "",
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
                        "field" => "newStatus",
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
