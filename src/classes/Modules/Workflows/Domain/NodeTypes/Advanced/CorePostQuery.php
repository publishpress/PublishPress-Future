<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Advanced;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CorePostQuery implements NodeTypeInterface
{
    const NODE_NAME = "action/core.query-post";

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

    public function getBaseSlug(): string
    {
        return "queryPost";
    }

    public function getLabel(): string
    {
        return __("Query Posts", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action retrieves multiple posts to serve as input for other actions.", "publishpress-future-pro");
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
                "label" => __("Post Query", "publishpress-future-pro"),
                "description" => __("This query defines the posts that will be passed to the next action in the workflow.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will be retrieved by this action.",
                            "publishpress-future-pro"
                        ),
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
                        "rule" => "format",
                        "field" => "postQuery.postId",
                        "format" => "integerList",
                        "label" => __("Post ID", "publishpress-future-pro"),
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
                "label" => __("Array of queried post IDs", "publishpress-future-pro"),
                "description" => __("The posts found following the criteria of the query.", "publishpress-future-pro"),
            ],
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "publishpress-future-pro"),
                "description" => __("The input data for this step.", "publishpress-future-pro"),
            ],
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-queryAction";
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
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
