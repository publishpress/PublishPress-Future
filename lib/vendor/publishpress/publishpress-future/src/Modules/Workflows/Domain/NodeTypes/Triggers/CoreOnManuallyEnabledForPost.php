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
        return __("Manually enabled via checkbox", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger activates when the option is manually enabled. It can be enabled via the post editing screen or the Quick Edit panel.", // phpcs:ignore Generic.Files.LineLength.TooLong
            "publishpress-future-pro"
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
                "label" => __("Settings", "publishpress-future-pro"),
                "description" => __("Settings for the trigger.", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "checkboxLabel",
                        "type" => "text",
                        "label" => __("Checkbox label", "publishpress-future-pro"),
                        "description" => __(
                            "The label of the checkbox that enables the trigger.",
                            "publishpress-future-pro"
                        ),
                    ],
                ]
            ],
            [
                "label" => __("Post Query", "publishpress-future-pro"),
                "description" => __(
                    "Specify the criteria for posts that will trigger this action. Leave blank to include all posts.",
                    "publishpress-future-pro"
                ),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "publishpress-future-pro"),
                        "description" => __(
                            "The query defines the posts that will trigger this action.",
                            "publishpress-future-pro"
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
                        "label" => __("Post Type", "publishpress-future-pro"),
                    ],
                    [
                        "rule" => "dataType",
                        "field" => "postQuery.postId",
                        "type" => "integerList",
                        "label" => __("Post ID", "publishpress-future-pro"),
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
                'label' => __("Saved post", "publishpress-future-pro"),
                'description' => __("The post that was saved, with the new properties.", "publishpress-future-pro"),
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
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
