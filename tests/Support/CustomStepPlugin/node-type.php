<?php

namespace PublishPress\FuturePro\Samples;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;

class AddMetadataNodeType implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/add.metadata";
    }

    public function getElementaryType(): string
    {
        return "action";
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "addMetadata";
    }

    public function getLabel(): string
    {
        return __("Add Metadata", "custom-step");
    }

    public function getDescription(): string
    {
        return __("This action adds a metadata to the post", "custom-step");
    }

    public function getIcon(): string
    {
        return "media-document";
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
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Metadata", "custom-step"),
                "description" => __("The metadata settings", "custom-step"),
                "fields" => [
                    [
                        "name" => "metadata_key",
                        "label" => __("Metadata Key", "custom-step"),
                        "type" => "text",
                        "description" => __("The metadata key", "custom-step"),
                    ],
                    [
                        "name" => "metadata_value",
                        "label" => __("Metadata Value", "custom-step"),
                        "type" => "text",
                        "description" => __("The metadata value", "custom-step"),
                    ]
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
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericTrigger";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [],
            "source" => [
                [
                    "id" => "output",
                    "left" => "50%",
                    "label" => __("Next", "custom-step"),
                ]
            ]
        ];
    }
}
