<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CorePostUnstick implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.unstick-post";
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
        return "unstickPost";
    }

    public function getLabel(): string
    {
        return __("Unstick post", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step unsticks a post.", "post-expirator");
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
                        "rule" => "hasIncomerOfName",
                        "name" => "advanced/core.schedule",
                        "message" => __(
                            "The Stick Post action must be part of a Schedule flow",
                            "post-expirator"
                        ),
                    ],
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "post.variable",
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
            ]
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
        return false;
    }
}
