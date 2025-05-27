<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Interfaces\StepTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class InteractiveDelay implements StepTypeInterface
{
    public static function getNodeTypeName(): string
    {
        return "advanced/interactive-delay";
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_ADVANCED;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
    }

    public function getBaseSlug(): string
    {
        return "interactiveDelay";
    }

    public function getLabel(): string
    {
        return __("Interactive delay", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step delays the execution of the workflow until the user interacts with the step.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "interactive";
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
        return "site";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Responders", "post-expirator"),
                "description" => __("Specify the responders for the interactive delay.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "responders",
                        "type" => "expression",
                        "label" => __("Responders", "post-expirator"),
                        "description" => __(
                            "A comma-separated list of user names, ids, emails or user roles that can interact with this step.",
                            "post-expirator"
                        ),
                        "default" => [
                            "expression" => "administrator",
                        ],
                    ],
                ],
            ],
            [
                "label" => __("Message", "post-expirator"),
                "description" => __("Specify the message to be displayed to the responders.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "subject",
                        "type" => "expression",
                        "label" => __("Subject", "post-expirator"),
                        "default" => [
                            "expression" => __('PublishPress Workflow: {{global.workflow.title}}', 'post-expirator'),
                        ],
                    ],
                    [
                        "name" => "message",
                        "type" => "expression",
                        "label" => __("Message", "post-expirator"),
                        "default" => [
                            "expression" => __("Please select an option to continue the workflow: {{global.workflow.title}}", "post-expirator"),
                        ],
                    ],
                ],
            ],
            [
                "label" => __("Options", "post-expirator"),
                "description" => __("Specify the options the user can choose from.", "post-expirator"),
                "fields" => [
                    [
                        "name" => "options",
                        "type" => "interactiveCustomOptions",
                        "label" => __("Options", "post-expirator"),
                        "description" => __("Configure the available response options for users. Each option can have a custom label and hint.", "post-expirator"),
                        "default" => [
                            [
                                "name" => "dismiss",
                                "label" => __("Dismiss", "post-expirator"),
                                "hint" => __("Dismiss the notification", "post-expirator"),
                            ],
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
                        "rule" => "hasIncomingConnection",
                    ],
                ]
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "responders.expression",
                        "label" => __("Responders", "post-expirator"),
                    ],
                    [
                        "rule" => "required",
                        "field" => "subject.expression",
                        "label" => __("Subject", "post-expirator"),
                    ],
                    [
                        "rule" => "required",
                        "field" => "message.expression",
                        "label" => __("Message", "post-expirator"),
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "responders.expression",
                        "label" => __("Responders", "post-expirator"),
                        "fieldLabel" => __("Responders > Responders", "post-expirator"),
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "subject.expression",
                        "label" => __("Subject", "post-expirator"),
                        "fieldLabel" => __("Message > Subject", "post-expirator"),
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "message.expression",
                        "label" => __("Message", "post-expirator"),
                        "fieldLabel" => __("Message > Message", "post-expirator"),
                    ],
                    [
                        "rule" => "validOptions",
                        "field" => "options",
                        "label" => __("Options", "post-expirator"),
                        "fieldLabel" => __("Options > Options", "post-expirator"),
                    ]
                ]
            ]
        ];
    }

    public function getStepScopedVariablesSchema(): array
    {
        return [];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Step input", "post-expirator"),
                "description" => __("The input data for this step.", "post-expirator"),
            ],
            [
                "name" => "responders",
                "type" => "string",
                "label" => __("Responders", "post-expirator"),
                "description" => __("The responders to the interactive delay, as a list of user ids.", "post-expirator"),
            ],
            [
                "name" => "optionName",
                "type" => "string",
                "label" => __("Option name", "post-expirator"),
                "description" => __("The name of the option selected by the user.", "post-expirator"),
            ],
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAdvanced";
    }

    public function getHandleSchema(): array
    {
        return [
            "target" => [
                [
                    "id" => "input",
                ]
            ],
            "source" => [
                [
                    "id" => "output",
                    "type" => "__dynamic__:options",
                    "label" => __("After interaction", "post-expirator"),
                ],
            ]
        ];
    }

    public function isProFeature(): bool
    {
        return true;
    }
}
