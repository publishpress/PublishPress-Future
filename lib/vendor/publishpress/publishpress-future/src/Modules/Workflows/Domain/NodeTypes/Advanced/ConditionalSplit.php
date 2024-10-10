<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class ConditionalSplit implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.conditional-split";
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
        return "conditionalSplit";
    }

    public function getLabel(): string
    {
        return __("Conditional Split", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step allows you to create a conditional branch.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "route";
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
        return "flow";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Conditions", "post-expirator"),
                "description" => __(
                    "THIS STEP IS JUST A PLACEHODLER FOR NOW. Not fully implemented yet. Only the True handle is implemented. False will not run the next actions for now.", // phpcs:ignore Generic.Files.LineLength.TooLong
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "test",
                        "type" => "text",
                        "label" => __("NOT IMPLEMENTED YET!", "post-expirator"),
                        "description" => __("Still not implemented", "post-expirator"),
                    ],
                ]
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
                    [
                        "rule" => "hasOutgoingConnection",
                    ]
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
            ],
            [
                "name" => "branch",
                "type" => "string",
                "label" => __("Branch", "post-expirator"),
                "description" => __("The current branch on this step.", "post-expirator"),
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
                    "id" => "true",
                    "left" => "25%",
                    "label" => __("True", "post-expirator"),
                ],
                [
                    "id" => "false",
                    "left" => "75%",
                    "label" => __("False", "post-expirator"),
                ]
            ]
        ];
    }

    public function isProFeature(): bool
    {
        return true;
    }
}
