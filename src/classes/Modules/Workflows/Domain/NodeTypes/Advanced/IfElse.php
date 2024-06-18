<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class IfElse implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.if-else";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_ADVANCED;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "simpleCondition";
    }

    public function getLabel(): string
    {
        return __("Simple Condition", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This step allows you to create a conditional branch.", "publishpress-future-pro");
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
        return "conditional";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Conditions", "publishpress-future-pro"),
                "description" => __(
                    "THIS STEP IS JUST A PLACEHODLER FOR NOW. Not fully implemented yet. Only the True handle is implemented. False will not run the next actions for now.", // phpcs:ignore Generic.Files.LineLength.TooLong
                    "publishpress-future-pro"
                ),
                "fields" => [
                    [
                        "name" => "test",
                        "type" => "text",
                        "label" => __("NOT IMPLEMENTED YET!", "publishpress-future-pro"),
                        "description" => __("Still not implemented", "publishpress-future-pro"),
                    ],
                ]
            ]
        ];
    }

    public function getValidationSchema(): array
    {
        return [];
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
                    "label" => __("True", "publishpress-future-pro"),
                ],
                [
                    "id" => "false",
                    "left" => "75%",
                    "label" => __("False", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
