<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CorePostChangeStatus implements NodeTypeInterface
{
    const NODE_NAME = "action/core.post-change-status";

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
        return __("Move post to status", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action moves a post to another status.", "publishpress-future-pro");
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
                "label" => __("New status", "publishpress-future-pro"),
                "description" => __("The new status that the post will be moved to.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "newStatus",
                        "type" => "postStatus",
                        "label" => __("New status", "publishpress-future-pro"),
                        "description" => __("The new status that the post will be moved to.", "publishpress-future-pro"),
                    ],
                ]
            ],
            [
                "label" => __("Post Query", "publishpress-future-pro"),
                "description" => __("The query defines the posts that will be moved to another status by this action. If no query is provided, no post will be updated.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will be updated by this action.",
                            "publishpress-future-pro"
                        ),
                        "settings" => [
                            "acceptsInput" => true,
                        ],
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
                "label" => __("Node input", "publishpress-future-pro"),
                "description" => __("The input data for this node.", "publishpress-future-pro"),
            ]
        ];
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
