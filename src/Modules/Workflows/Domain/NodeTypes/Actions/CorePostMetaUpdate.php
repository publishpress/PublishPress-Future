<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CorePostMetaUpdate implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.post-meta-update";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "postMetaUpdate";
    }

    public function getLabel(): string
    {
        return __("Update post meta", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step updates post meta for a post.", "post-expirator");
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
                "label" => __("Post", "post-expirator"),
                "description" => __("The post to update.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "post",
                        "type" => "postInput",
                        "label" => __("Post", "post-expirator"),
                        "description" => __(
                            "Select the variable that contains the post to update. It can be a post instance or the post ID.", // phpcs:ignore Generic.Files.LineLength.TooLong
                            "post-expirator"
                        ),
                    ],
                ],
            ],
            [
                "label" => __("Meta", "post-expirator"),
                "description" => __("The meta to update for the post.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "metaKey",
                        "type" => "text",
                        "label" => __("Meta key", "post-expirator"),
                        "description" => __("The meta key to update for the post.", "post-expirator"),
                    ],
                    [
                        "name" => "metaValue",
                        "type" => "expression",
                        "label" => __("Meta value", "post-expirator"),
                        "description" => __("The meta value to update for the post.", "post-expirator"),
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
                        "field" => "post.variable",
                    ],
                    [
                        "rule" => "required",
                        "field" => "metaKey",
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
            ],
            [
                "name" => "metaId",
                "type" => "integer",
                "label" => __("Meta ID", "post-expirator"),
                "description" => __("The ID of the meta updated for the post.", "post-expirator"),
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
        return true;
    }
}
