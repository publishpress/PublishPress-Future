<?php

namespace PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\Future\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\Future\Modules\Workflows\Models\NodeTypesModel;

class CoreSendEmail implements NodeTypeInterface
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
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getReactFlowNodeType(): string
    {
        return "generic";
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
        return "messages";
    }

    public function getSettingsSchema(): array
    {
        return [
            [
                "label" => __("Message", "post-expirator"),
                "description" => __("The email message", "post-expirator"),
                "fields" => [
                    [
                        "name" => "recipient",
                        "type" => "emailRecipient",
                        "label" => __("Recipient", "post-expirator"),
                        "default" => [
                            "recipient" => "global.site.admin_email",
                        ],
                    ],
                    [
                        "name" => "subject",
                        "type" => "textarea",
                        "label" => __("Subject", "post-expirator"),
                        "settings" => [
                            "placeholder" => self::getDefaultSubject(),
                        ],
                    ],
                    [
                        "name" => "message",
                        "type" => "textarea",
                        "label" => __("Message", "post-expirator"),
                        "settings" => [
                            "placeholder" => self::getDefaultMessage(),
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
                        "field" => "recipient.recipient",
                        "label" => __("Email Recipient", "post-expirator"),
                    ],
                    [
                        "rule" => "required",
                        "field" => "recipient.custom",
                        "label" => __("Custom Email Address", "post-expirator"),
                        "condition" => [
                            "field" => "recipient.recipient",
                            "value" => "custom",
                        ],
                    ],
                    [
                        "rule" => "dataType",
                        "field" => "recipient.custom",
                        "label" => __("Custom Email Address", "post-expirator"),
                        "type" => "emailList",
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
        return true;
    }
}
