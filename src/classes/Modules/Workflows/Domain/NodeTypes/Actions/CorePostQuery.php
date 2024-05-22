<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

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
        return __("This action query posts to be passed to other nodes.", "publishpress-future-pro");
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
                "description" => __("The query defines the posts that will be passed to next nodes by this action. If no query is provided, no post will be outputed.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will be selected by this action.",
                            "publishpress-future-pro"
                        ),
                    ],
                ]
            ]
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
            ]
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
