<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class LogAdd implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/log.add";
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
        return "logAdd";
    }

    public function getLabel(): string
    {
        return __("Log - Add", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step transmits the flow's data to the debug log.", "post-expirator");
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
                "label" => __("Debug output", "post-expirator"),
                "description" => __("The message to be sent to the debug log.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "message",
                        "type" => "textarea",
                        "label" => __("Message", "post-expirator"),
                    ],
                    [
                        "name" => "level",
                        "type" => "debugLevels",
                        "label" => __("Level", "post-expirator")
                    ],
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
                "label" => __("Step input", "post-expirator"),
                "description" => __("The input data for this step.", "post-expirator"),
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
