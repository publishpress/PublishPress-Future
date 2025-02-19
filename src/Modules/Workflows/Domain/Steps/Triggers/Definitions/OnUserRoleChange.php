<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Triggers\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class OnUserRoleChange implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "trigger/core.user-role-changed";
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
        return "onUserRoleChange";
    }

    public function getLabel(): string
    {
        return __("User role is changed", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This trigger activates when a user's role is changed.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "admin-users";
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
        return "user";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("User Query", "post-expirator"),
                "description" => __(
                    "Specify the criteria for users whose role changes will trigger this action.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "userQuery",
                        "type" => "userQuery",
                        "label" => __("User query", "post-expirator"),
                        "description" => __(
                            "The query defines the users that will trigger this action.",
                            "post-expirator"
                        ),
                        "settings" => [
                            "labels" => [
                                "userRole" => __(
                                    "User Role before change",
                                    "post-expirator"
                                ),
                            ],
                        ],
                    ],
                ]
            ],
            [
                "label" => __("Authors Post Query", "post-expirator"),
                "description" => __(
                    "Filter the event to only trigger for users who are authors of posts matching these criteria.",
                    "post-expirator"
                ),
                "fields" => [
                    [
                        "name" => "postQuery",
                        "type" => "postQuery",
                        "label" => __("Post query", "post-expirator"),
                        "settings" => [
                            "acceptsInput" => false,
                            "postTypeDescription" => __("Select the post types authored by the user.", "post-expirator"),
                            "postIdDescription" => __("Enter one or more post IDs authored by the user. Leave empty to include all their posts.", "post-expirator"),
                            "postStatusDescription" => __("If selected, only posts with these statuses authored by the user will be considered.", "post-expirator"),
                        ],
                        "default" => [
                            "postSource" => "custom",
                            "postId" => [],
                            "postStatus" => [],
                        ],
                    ],
                ],
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

    public function getOutputSchema(): array
    {
        return [
            [
                'name' => 'user',
                'type' => 'user',
                'label' => __("User that data was changed for", "post-expirator"),
                'description' => __("The user that data was changed for.", "post-expirator"),
            ],
            [
                'name' => 'addedRoles',
                'type' => 'array',
                'label' => __("Added roles", "post-expirator"),
                'description' => __("The roles that were added to the user.", "post-expirator"),
            ],
            [
                'name' => 'removedRoles',
                'type' => 'array',
                'label' => __("Removed roles", "post-expirator"),
                'description' => __("The roles that were removed from the user.", "post-expirator"),
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
