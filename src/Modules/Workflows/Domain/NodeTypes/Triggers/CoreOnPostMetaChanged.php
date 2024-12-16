<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Triggers;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CoreOnPostMetaChanged implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.post-meta-changeds";
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
        return "onPostMetaChanged";
    }

    public function getLabel(): string
    {
        return __("Post meta changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates when a post meta field is changed.", "post-expirator");
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
                "label" => __("Post Query", "post-expirator"),
                "description" => __(
                    "Specify the criteria for posts that will trigger this action.",
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
                            "isPostTypeRequired" => true,
                            "hidePostStatus" => true,
                        ],
                        "default" => [
                            "postSource" => "custom",
                            "postType" => ["post"],
                            "postId" => [],
                            "postStatus" => [],
                        ],
                    ],
                ]
            ],
            [
                "label" => __("Meta settings", "post-expirator"),
                "description" => __("Specify the criteria for the meta to watch for changes.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "metaKeys",
                        "type" => "text",
                        "label" => __("Meta keys", "post-expirator"),
                        "description" => __("The meta keys (separated by commas) to watch for changes.", "post-expirator"),
                        "default" => [],
                    ]
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
                'label' => __("Post", "post-expirator"),
                'description' => __("The post that triggered this action.", "post-expirator"),
            ],
            [
                'name' => 'action',
                'type' => 'string',
                'label' => __("Action", "post-expirator"),
                'description' => __("The action taken when the meta key is changed.", "post-expirator"),
            ],
            [
                'name' => 'metaId',
                'type' => 'integer',
                'label' => __("Meta ID", "post-expirator"),
                'description' => __("The meta ID.", "post-expirator"),
            ],
            [
                'name' => 'metaKey',
                'type' => 'string',
                'label' => __("Meta key", "post-expirator"),
                'description' => __("The meta key that was changed.", "post-expirator"),
            ],
            [
                'name' => 'metaValue',
                'type' => 'string',
                'label' => __("New meta value", "post-expirator"),
                'description' => __("The new meta value.", "post-expirator"),
            ],
            [
                'name' => 'oldMetaValue',
                'type' => 'string',
                'label' => __("Old meta value", "post-expirator"),
                'description' => __("The meta value before the change.", "post-expirator"),
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
        return true;
    }
}
