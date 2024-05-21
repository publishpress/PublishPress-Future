<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\NodeTypes\Actions;

use PublishPress\FuturePro\Modules\Workflows\Interfaces\NodeTypeInterface;
use PublishPress\FuturePro\Modules\Workflows\Models\NodeTypesModel;

class CoreSendEmail implements NodeTypeInterface
{
    const NODE_NAME = "action/core.send-email";

    public static function getDefaultSubject()
    {
        return __('PublishPress Workflow: {{global.workflow.title}}', 'publishpress-future-pro');
    }

    public static function getDefaultMessage()
    {
        return __('This is a message sent by PublishPress Workflow: {{global.workflow.title}}.', 'publishpress-future-pro');
    }

    public function getElementarType(): string
    {
        return NodeTypesModel::NODE_TYPE_ACTION;
    }

    public function getType(): string
    {
        return "generic";
    }

    public function getName(): string
    {
        return self::NODE_NAME;
    }

    public function getLabel(): string
    {
        return __("Send Email", "publishpress-future-pro");
    }

    public function getDescription(): string
    {
        return __("This action sends a message by email.", "publishpress-future-pro");
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
                "label" => __("Message", "publishpress-future-pro"),
                "description" => __("The email message", "publishpress-future-pro"),
                "fields" => [
                    [
                        "name" => "recipient",
                        "type" => "emailRecipient",
                        "label" => __("Recipient", "publishpress-future-pro"),
                        "settings" => [
                            "defaultRecipient" => "global.site.admin_email",
                        ],
                    ],
                    [
                        "name" => "subject",
                        "type" => "text",
                        "label" => __("Subject", "publishpress-future-pro"),
                        "settings" => [
                            "placeholder" => self::getDefaultSubject(),
                        ],
                    ],
                    [
                        "name" => "message",
                        "type" => "textarea",
                        "label" => __("Message", "publishpress-future-pro"),
                        "settings" => [
                            "placeholder" => self::getDefaultMessage(),
                        ],
                    ]
                ],
            ]
        ];
    }

    public function getOutputSchema(): array
    {
        return [
            [
                "name" => "input",
                "type" => "input",
                "label" => __("Node input", "publishpress-future-pro"),
                "description" => __("The input data for this node.", "publishpress-future-pro"),
            ]
        ];
    }

    public function getCSSClass(): string
    {
        return "react-flow__node-genericAction";
    }

    public function getSocketSchema(): array
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
                    "label" => __("Next", "publishpress-future-pro"),
                ]
            ]
        ];
    }
}
