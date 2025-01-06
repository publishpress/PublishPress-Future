<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CorePostDeactivateWorkflow implements NodeTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "action/core.post-deactivate-workflow";
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
        return "deactivateWorkflowForPost";
    }

    public function getLabel(): string
    {
        return __("Deactivate Workflow for Post", "post-expirator");
    }

    public function getDescription(): string
    {
        return __(
            "This step enables you to deactivate the \"Manually enabled via checkbox\" workflow after use.",
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
                    [
                        "name" => "workflow",
                        "type" => "manualWorkflowInput",
                        "default" => [
                            "variable" => "global.workflow",
                        ],
                        "label" => __("Workflow", "post-expirator"),
                        "description" => __(
                            "Select the manually enabling workflow that will be deactivated for the selected post.", // phpcs:ignore Generic.Files.LineLength.TooLong
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
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "post.variable",
                        "label" => __("Post", "post-expirator"),
                    ],
                    [
                        "rule" => "required",
                        "field" => "workflow.variable",
                        "label" => __("Workflow", "post-expirator"),
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
