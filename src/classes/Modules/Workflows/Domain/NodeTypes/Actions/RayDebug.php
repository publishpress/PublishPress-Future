<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class RayDebug implements NodeTypeInterface
{
    const NODE_NAME = "action/ray.debug";

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getLabel(): string
    {
        return __("Ray - Debug", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action sends the flow data to Ray.", "publishpress-future-pro");
    }

    public function getIcon(): string
    {
        return "fa6-fabug";
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
                        "type" => "debug_data",
                        "label" => __("Data", "publishpress-future-pro"),
                    ],
                    [
                        "name" => "color",
                        "type" => "ray_color",
                        "label" => __("Color", "publishpress-future-pro"),
                    ]
                ],
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAction";
    }

    public function getSocketSchema(): array
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
                ]
            ]
        ];
    }
}
