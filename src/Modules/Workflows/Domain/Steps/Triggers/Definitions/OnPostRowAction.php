<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnPostRowAction implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.post-row-action";
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
        return "onPostRowAction";
    }

    public function getLabel(): string
    {
        return __("Manually run via posts row action", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This trigger creates a custom post row action and activates when the row action is clicked in the Posts list screen.", // phpcs:ignore Generic.Files.LineLength.TooLong
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
        return 2;
    }

    public function getCategory(): string
    {
        return "post";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Row Action", "post-expirator"),
                "description" => __(
                    "Configure the post row action that will be created in the Posts list screen.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "actionLabel",
                        "type" => "text",
                        "label" => __("Action label", "post-expirator"),
                        "description" => __(
                            "The label of the action created in the post row for this trigger.",
                            "post-expirator"
                        ),
                        "settings" => [
                            "placeholder" => __("Run workflow", "post-expirator"),
                        ],
                    ],
                    [
                        "name" => "askForConfirmation",
                        "type" => "askForConfirmation",
                        "label" => __("Ask for confirmation", "post-expirator"),
                        "description" => __(
                            "If enabled, the user will be asked to confirm the action before it is executed.",
                            "post-expirator"
                        ),
                        "default" => [
                            "enabled" => false,
                            "message" => __("Are you sure you want to run this action?", "post-expirator"),
                        ],
                    ],
                ],
            ],
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
                            "postTypeDescription" => __("Select the post types that will trigger this action.", "post-expirator"),
                            "postIdDescription" => __("Enter one or more post IDs. Leave empty to include all posts.", "post-expirator"),
                            "postStatusDescription" => __("If selected, only posts with these statuses will trigger this action.", "post-expirator"),
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

    public function getStepScopedVariablesSchema(): array
    {
        return [

        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'post',
                'type' => 'post',
                'label' => __("Triggered post", "post-expirator"),
                'description' => __("The post where the action was triggered.", "post-expirator"),
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
