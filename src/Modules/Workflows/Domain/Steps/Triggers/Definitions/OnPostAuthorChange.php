<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnPostAuthorChange implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.post-author-changed";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_TRIGGER;
    }

    public function getReactFlowNodeType(): string
    {
        return "trigger";
    }

    public function getBaseSlug(): string
    {
        return "onPostAuthorChange";
    }

    public function getLabel(): string
    {
        return __("Post author changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates when an existing post author is changed.", "post-expirator");
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
                "label" => __("Conditions", "post-expirator"),
                "description" => __(
                    "Specify the criteria for posts that will trigger this action.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postFilter",
                        "label" => __("Post filter", "post-expirator"),
                        "description" => __(
                            "The filter defines the posts that will trigger this action.",
                            "post-expirator"
                        ),
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
            "connections" => [
                "rules" => [
                    [
                        "rule" => "hasOutgoingConnection",
                    ],
                ]
            ]
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return $this->getOutputSchema();
    }

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'postBefore',
                'type' => 'post',
                'label' => __("Post Before Update", "post-expirator"),
                'description' => __("The post that was saved, with the old properties.", "post-expirator"),
            ],
            [
                'name' => 'postAfter',
                'type' => 'post',
                'label' => __("Post After Update", "post-expirator"),
                'description' => __("The post that was saved, with the new properties.", "post-expirator"),
            ],
            [
                "name" => "postId",
                "type" => "integer",
                "label" => __("Post ID", "post-expirator"),
                "description" => __("The ID of the post that was updated.", "post-expirator"),
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
