<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class WooCreateOrder implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.woo-order-create";
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
        return "wooCreateOrder";
    }

    public function getLabel(): string
    {
        return __("Create an order", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step creates a new WooCommerce order with a product.", "post-expirator");
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
    private function getOrderStatusOptions(): array
    {
        $options = [];

        if (function_exists('wc_get_order_statuses')) {
            foreach (wc_get_order_statuses() as $key => $label) {
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
                "label" => __("Order", "post-expirator"),
                "description" => __("The order to create.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "productId",
                        "type" => "expression",
                        "label" => __("Product ID", "post-expirator"),
                        "description" => __("The product to add to the order.", "post-expirator"),
                    ],
                    [
                        "name" => "quantity",
                        "type" => "expression",
                        "label" => __("Quantity", "post-expirator"),
                        "description" => __("The quantity of the product. Defaults to 1.", "post-expirator"),
                    ],
                    [
                        "name" => "customerId",
                        "type" => "expression",
                        "label" => __("Customer ID (optional)", "post-expirator"),
                        "description" => __("The user ID to assign the order to.", "post-expirator"),
                    ],
                    [
                        "name" => "status",
                        "type" => "select",
                        "label" => __("Status", "post-expirator"),
                        "description" => __("The status of the new order.", "post-expirator"),
                        "settings" => [
                            "options" => $this->getOrderStatusOptions(),
                        ],
                        "default" => "pending",
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
                    ["rule" => "required", "field" => "productId"],
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
