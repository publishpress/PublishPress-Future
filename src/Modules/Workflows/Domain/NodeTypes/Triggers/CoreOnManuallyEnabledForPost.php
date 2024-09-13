<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CoreOnManuallyEnabledForPost implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.manually-enabled-for-post";
    }

    public function getElementaryType(): string
    {
        return NodeTypesModel::NODE_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onManualEnableForPost";
    }

    public function getLabel(): string
    {
        return __("Manually enabled via checkbox", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when the option is manually enabled. It can be enabled via the post editing screen or the Quick Edit panel.", // phpcs:ignore Generic.Files.LineLength.TooLong
            "post-expirator"
        );
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
                "label" => __("Settings", "post-expirator"),
                "description" => __("Settings for the trigger.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "checkboxLabel",
                        "type" => "text",
                        "label" => __("Checkbox label", "post-expirator"),
                        "description" => __(
                            "The label of the checkbox that enables the trigger.",
                            "post-expirator"
                        ),
                    ],
                ]
            ],
            [
                "label" => __("Post Query", "post-expirator"),
                "description" => __(
                    "Specify the criteria for posts that will trigger this action. Leave blank to include all posts.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "post-expirator"),
                        "description" => __(
                            "The query defines the posts that will trigger this action.",
                            "post-expirator"
                        ),
                        "settings" => [
                            "acceptsInput" => false,
                        ],
                        "default" => [
                            "postSource" => "custom",
                            "postType" => ["post"],
                            "postId" => [],
                            "postStatus" => [],
                        ],
                    ],
                ]
            ]
        ];
    }

    public function getValidationSchema(): array
    {
        return [
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
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'post',
                'type' => 'post',
                'label' => __("Saved post", "post-expirator"),
                'description' => __("The post that was saved, with the new properties.", "post-expirator"),
            ]
        ];
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
