<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CoreSchedule implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.schedule";
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
        return "schedule";
    }

    public function getLabel(): string
    {
        return __("Schedule", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step enables actions to be scheduled. You can choose when to run the next step.", // phpcs:ignore Generic.Files.LineLength.TooLong
            "post-expirator"
        );
    }

    public function getIcon(): string
    {
        return "schedule";
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
        return "async";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Schedule", "post-expirator"),
                "description" => __("A scheduled delay between steps.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "schedule",
                        "type" => "dateOffset",
                        "label" => __("Date offset", "post-expirator"),
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
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
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
            ],
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAdvanced";
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
