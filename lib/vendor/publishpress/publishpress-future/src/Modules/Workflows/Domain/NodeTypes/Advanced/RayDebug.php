<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class RayDebug implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/ray.debug";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_ADVANCED;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "rayDebug";
    }

    public function getLabel(): string
    {
        return __("Ray - Debug", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This step transmits the flow's data to Ray Debug.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "debug";
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
        return "debug";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Debug output", "publishpress-future-pro"),
                "description" => __("The data to be sent to Ray.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "data",
                        "type" => "debugData",
                        "label" => __("Data", "publishpress-future-pro"),
                    ],
                    [
                        "name" => "label",
                        "type" => "text",
                        "label" => __("Label", "publishpress-future-pro"),
                    ],
                    [
                        "name" => "color",
                        "type" => "rayColor",
                        "label" => __("Color", "publishpress-future-pro"),
                    ]
                ],
            ]
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
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "publishpress-future-pro"),
                "description" => __("The input data for this step.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-debugAction";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [
                [
                    "id" => "input",
                    "left" => "50%",
                ]
            ],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
