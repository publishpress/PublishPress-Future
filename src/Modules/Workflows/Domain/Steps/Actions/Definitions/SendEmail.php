<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Definitions;

use PublishPress\Future\Modules\Workflows\Domain\Steps\AbstractStepType;
use PublishPress\Future\Modules\Workflows\Models\StepTypesModel;

class SendEmail extends AbstractStepType
{
    public static function getNodeTypeName(): string
    {
        return "action/core.send-email";
    }

    public static function getDefaultSubject()
    {
        return __('PublishPress Workflow: {{global.workflow.title}}', 'post-expirator');
    }

    public static function getDefaultMessage()
    {
        return __(
            'This is a message sent by PublishPress Workflow: {{global.workflow.title}}.',
            'post-expirator'
        );
    }

    public function getElementaryType(): string
    {
        return StepTypesModel::STEP_TYPE_ACTION;
    }

    public function getBaseSlug(): string
    {
        return "sendEmail";
    }

    public function getLabel(): string
    {
        return __("Send email", "post-expirator");
    }

    public function getDescription(): string
    {
        return __("This step dispatches a message via email.", "post-expirator");
    }

    public function getIcon(): string
    {
        return "email";
    }

    public function getCategory(): string
    {
        return "messages";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Email Message", "post-expirator"),
                "description" => __("The email message configuration", "post-expirator"),
                "fields" => [
                    [
                        "name" => "recipient",
                        "type" => "expression",
                        "label" => __("Recipient", "post-expirator"),
                        "description" => __("A comma-separated list of email addresses to send the message to.", "post-expirator"),
                        "default" => [
                            "expression" => "{{global.site.admin_email}}",
                        ],
                    ],
                    [
                        "name" => "subject",
                        "type" => "expression",
                        "label" => __("Subject", "post-expirator"),
                        "default" => [
                            "expression" => self::getDefaultSubject(),
                        ],
                    ],
                    [
                        "name" => "message",
                        "type" => "expression",
                        "label" => __("Message", "post-expirator"),
                        "default" => [
                            "expression" => self::getDefaultMessage(),
                        ],
                    ]
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
                ],
            ],
            "settings" => [
                "rules" => [
                    [
                        "rule" => "required",
                        "field" => "recipient.expression",
                        "label" => __("Recipient", "post-expirator"),
                    ],
                    [
                        "rule" => "dataType",
                        "field" => "recipient.expression",
                        "label" => __("Recipient", "post-expirator"),
                        "type" => "emailList",
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "recipient.expression",
                        "label" => __("Recipient", "post-expirator"),
                        "fieldLabel" => __("Email Message > Recipient", "post-expirator"),
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "subject.expression",
                        "label" => __("Subject", "post-expirator"),
                        "fieldLabel" => __("Email Message > Subject", "post-expirator"),
                    ],
                    [
                        "rule" => "validExpression",
                        "field" => "message.expression",
                        "label" => __("Message", "post-expirator"),
                        "fieldLabel" => __("Email Message > Message", "post-expirator"),
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
                "label" => __("Step input", "post-expirator"),
                "description" => __("The input data for this step.", "post-expirator"),
            ]
        ];
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
                    "label" => __("Next", "post-expirator"),
                ]
            ]
        ];
    }

}
