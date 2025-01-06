<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CorePostQuery implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/core.query-post";
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
        return "queryPost";
    }

    public function getLabel(): string
    {
        return __("Query posts", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step defines the posts that will be passed to the next step in the workflow.",
            "post-expirator"
        );
    }

    public function getIcon(): string
    {
        return "db-query";
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
        return "db-query";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Post Query", "post-expirator"),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "post-expirator"),
                        "description" => __(
                            "The query defines the posts that will be retrieved by this action.",
                            "post-expirator"
                        ),
                        "default" => [
                            "postSource" => "custom",
                            "postType" => ["post"],
                            "postId" => [],
                            "postStatus" => [],
                        ],
                        "settings" => [
                            "isPostTypeRequired" => true,
                        ],
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
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "postQuery.postType",
                        "label" => __("Post Type", "post-expirator"),
                    ],
                    [
                        "rule" => "dataType",
                        "field" => "postQuery.postId",
                        "type" => "integerList",
                        "label" => __("Post ID", "post-expirator"),
                    ],
                ],
            ],
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "posts",
                "type" => "array",
                "itemsType" => "integer",
                "label" => __("Array of queried post IDs", "post-expirator"),
                "description" => __("The posts found following the criteria of the query.", "post-expirator"),
            ],
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
        return "react-flow__node-queryAction";
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
